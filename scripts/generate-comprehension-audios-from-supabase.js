/**
 * Supabase'teki comprehension_questions kayıtlarından okuyarak
 * public/audios/sorular/ altında generate-comprehension-question-audios.js ile aynı isimlendirmeyi kullanır:
 *   question-{storyId}-q{question_order}.mp3
 *   option-{storyId}-q{question_order}-{A|B|C|D}.mp3
 *   correct- / wrong- ...
 *
 * Kullanım: node scripts/generate-comprehension-audios-from-supabase.js [startStory] [endStory]
 * Örnek: node scripts/generate-comprehension-audios-from-supabase.js 13 24
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
    const envContent = readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          process.env[key.trim()] = value;
        }
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('VITE_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY (veya anon) gerekli.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DELAY_MS = 250;

async function main() {
  const startStory = parseInt(process.argv[2] || '13', 10);
  const endStory = parseInt(process.argv[3] || String(startStory), 10);

  console.log(`Supabase → ses: hikaye ${startStory} – ${endStory}\n`);

  for (let storyId = startStory; storyId <= endStory; storyId++) {
    const { data: rows, error } = await supabase
      .from('comprehension_questions')
      .select(
        'question_order, question_text, option_a, option_b, option_c, option_d, correct_option'
      )
      .eq('story_id', storyId)
      .order('question_order', { ascending: true });

    if (error) {
      console.error(`Hikaye ${storyId}: okuma hatası`, error.message);
      continue;
    }
    if (!rows?.length) {
      console.warn(`Hikaye ${storyId}: soru yok, atlanıyor.`);
      continue;
    }

    console.log(`\n📖 Hikaye ${storyId} — ${rows.length} soru`);

    for (const q of rows) {
      const order = q.question_order;
      const questionId = `q${order}`;
      const questionData = {
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: q.correct_option,
      };

      console.log(`  📝 ${questionId} …`);
      try {
        const result = await generateQuestionAudios(storyId, questionId, questionData);
        if (result.errors?.length) {
          console.warn(`     ⚠️ ${result.errors.length} parça hata`);
        } else {
          console.log(`     ✅ ${result.files.length} dosya`);
        }
      } catch (e) {
        console.error(`     ❌`, e.message || e);
      }
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  console.log('\n✅ Bitti.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
