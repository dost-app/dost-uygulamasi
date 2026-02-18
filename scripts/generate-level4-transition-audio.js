/**
 * 4. Seviye 1. Adım – Bölüm geçişi sesi.
 * "Şimdi diğer bölüme geçiyorum. Dikkatle takip et."
 * Çıktı: public/audios/level4/gecis-diger-bolume.mp3 ve src/assets/audios/level4/
 */
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VOICE_API_URL = 'https://arge.muhbirai.com/webhook/dost/voice-generator';
const TEXT = 'Şimdi diğer bölüme geçiyorum. Dikkatle takip et.';
const OUTPUT_FILE = 'gecis-diger-bolume.mp3';
const PUBLIC_DIR = join(__dirname, '..', 'public', 'audios', 'level4');
const ASSETS_DIR = join(__dirname, '..', 'src', 'assets', 'audios', 'level4');

async function generateAndSave() {
  console.log('🎤 4. Seviye bölüm geçiş sesi oluşturuluyor...');
  try {
    const res = await fetch(VOICE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: TEXT }),
    });
    if (!res.ok) throw new Error(`API: ${res.status}`);
    const data = await res.json();
    if (!data.audioBase64) throw new Error('audioBase64 yok');
    const buffer = Buffer.from(data.audioBase64, 'base64');
    for (const dir of [PUBLIC_DIR, ASSETS_DIR]) {
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, OUTPUT_FILE), buffer);
      console.log('✅', join(dir, OUTPUT_FILE));
    }
  } catch (e) {
    console.error('❌', e.message);
    process.exit(1);
  }
}
generateAndSave();
