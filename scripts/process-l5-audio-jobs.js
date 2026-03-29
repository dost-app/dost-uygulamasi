/**
 * Kuyruktaki L5 anlama sorusu işlerini işler: Supabase'ten soru metnini alır,
 * TTS ile MP3 üretir (generate-comprehension-question-audios ile aynı mantık),
 * public/audios/sorular/ altına yazar.
 *
 * Ortam: SUPABASE_SERVICE_ROLE_KEY, VITE_SUPABASE_URL
 *
 * GitHub Actions veya cron ile çalıştırın; ardından oluşan MP3'leri commit + push + deploy.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { generateQuestionAudios } from './generate-comprehension-question-audios.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnv() {
  const envPath = join(__dirname, '..', '.env');
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
      const t = line.trim();
      if (t && !t.startsWith('#')) {
        const i = t.indexOf('=');
        if (i > 0) {
          const k = t.slice(0, i).trim();
          let v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
          process.env[k] = v;
        }
      }
    }
  }
}

loadEnv();

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!url || !key) {
  console.error('VITE_SUPABASE_URL (veya SUPABASE_URL) ve SUPABASE_SERVICE_ROLE_KEY gerekli.');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const MAX_JOBS_PER_RUN = 20;

async function claimNextJob() {
  const { data: row } = await supabase
    .from('l5_audio_jobs')
    .select('id')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!row?.id) return null;

  const { data: updated, error } = await supabase
    .from('l5_audio_jobs')
    .update({ status: 'processing', updated_at: new Date().toISOString() })
    .eq('id', row.id)
    .eq('status', 'pending')
    .select()
    .single();

  if (error || !updated) return null;
  return updated;
}

async function processJob(job) {
  const { data: q, error: qErr } = await supabase
    .from('comprehension_questions')
    .select(
      'question_text, option_a, option_b, option_c, option_d, correct_option, question_order'
    )
    .eq('story_id', job.story_id)
    .eq('question_order', job.question_order)
    .maybeSingle();

  if (qErr || !q) {
    await supabase
      .from('l5_audio_jobs')
      .update({
        status: 'failed',
        error_message: qErr?.message || 'Soru bulunamadı',
        attempts: job.attempts + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.id);
    return;
  }

  const questionData = {
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
    correct_option: q.correct_option,
  };

  const questionId = `q${q.question_order}`;

  try {
    const result = await generateQuestionAudios(job.story_id, questionId, questionData);
    const hasErrors = result.errors?.length > 0;
    const okCount = result.files?.length || 0;

    if (hasErrors && okCount < 7) {
      const msg = result.errors.map((e) => `${e.type}: ${e.error}`).join('; ');
      await supabase
        .from('l5_audio_jobs')
        .update({
          status: 'failed',
          error_message: msg.slice(0, 2000),
          attempts: job.attempts + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', job.id);
      return;
    }

    await supabase
      .from('l5_audio_jobs')
      .update({
        status: 'done',
        error_message: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.id);

    console.log(`✅ Job ${job.id} story ${job.story_id} ${questionId} (${okCount} dosya)`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await supabase
      .from('l5_audio_jobs')
      .update({
        status: 'failed',
        error_message: msg.slice(0, 2000),
        attempts: job.attempts + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.id);
    console.error(`❌ Job ${job.id}:`, msg);
  }
}

async function main() {
  console.log('L5 audio job işleyici başlıyor…');
  let n = 0;
  for (let i = 0; i < MAX_JOBS_PER_RUN; i++) {
    const job = await claimNextJob();
    if (!job) break;
    n++;
    console.log(`\n📋 İş ${n}: ${job.id} — hikaye ${job.story_id}, soru sırası ${job.question_order}`);
    await processJob({ ...job, attempts: job.attempts ?? 0 });
  }
  if (n === 0) console.log('Bekleyen iş yok.');
  else console.log(`\nTamamlandı: ${n} iş işlendi.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
