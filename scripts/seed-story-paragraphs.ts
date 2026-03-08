/**
 * Tüm hikaye paragraflarını (FALLBACK_STORIES 1–24) Supabase story_paragraphs tablosuna yükler.
 * Kullanım: npm run seed:paragraphs
 * Gerekli: .env içinde VITE_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY (veya VITE_SUPABASE_ANON_KEY)
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { FALLBACK_STORIES } from '../src/data/fallback-stories-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnv() {
  const envPath = join(__dirname, '..', '.env');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eq = trimmed.indexOf('=');
        if (eq > 0) {
          const key = trimmed.slice(0, eq).trim();
          const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ .env içinde VITE_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY (veya VITE_SUPABASE_ANON_KEY) gerekli.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
});

async function main() {
  let uploaded = 0;
  let failed = 0;
  for (let storyId = 1; storyId <= 24; storyId++) {
    const paragraphs = FALLBACK_STORIES[storyId];
    if (!paragraphs?.length) continue;
    const { error: delErr } = await supabase
      .from('story_paragraphs')
      .delete()
      .eq('story_id', storyId);
    if (delErr) console.warn(`Hikaye ${storyId} silme:`, delErr.message);
    const rows = paragraphs.map((p, i) => ({
      story_id: storyId,
      paragraph_index: i,
      text_segments: p,
    }));
    const { error: insErr } = await supabase.from('story_paragraphs').insert(rows);
    if (insErr) {
      console.error(`Hikaye ${storyId} ekleme:`, insErr.message);
      failed++;
    } else {
      uploaded++;
      console.log(`Hikaye ${storyId}: ${paragraphs.length} paragraf yüklendi.`);
    }
  }
  console.log(`\nToplam: ${uploaded} hikaye yüklendi${failed ? `, ${failed} hata.` : '.'}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
