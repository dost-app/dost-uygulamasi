/**
 * 3. Seviye 1. Adım – "Sıra sende" ses dosyası oluşturur.
 * Metin: "Hadi sıra sende mikrofona tıklayarak aynı paragrafı oku."
 * Çıktı: public/audios/level3/seviye-3-adim-1-sira-sende.mp3
 *
 * Kullanım: node scripts/generate-level3-step1-sira-sende.js
 */
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VOICE_API_URL = 'https://arge.muhbirai.com/webhook/dost/voice-generator';

const TEXT = 'Hadi sıra sende mikrofona tıklayarak aynı paragrafı oku.';
const OUTPUT_FILE = 'seviye-3-adim-1-sira-sende.mp3';
const PUBLIC_DIR = join(__dirname, '..', 'public', 'audios', 'level3');
const ASSETS_DIR = join(__dirname, '..', 'src', 'assets', 'audios', 'level3');

async function generateAndSave() {
  console.log('🎤 3. Seviye 1. Adım – sıra sende sesi oluşturuluyor...');
  console.log('📝 Metin:', TEXT);
  console.log('');

  try {
    const res = await fetch(VOICE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: TEXT }),
    });

    if (!res.ok) {
      throw new Error(`API isteği başarısız: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.audioBase64) {
      throw new Error('API yanıtında audioBase64 bulunamadı');
    }

    const buffer = Buffer.from(data.audioBase64, 'base64');

    for (const dir of [PUBLIC_DIR, ASSETS_DIR]) {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      const outputPath = join(dir, OUTPUT_FILE);
      writeFileSync(outputPath, buffer);
      console.log('✅ Kaydedildi:', outputPath);
    }

    console.log('   Boyut:', (buffer.length / 1024).toFixed(2), 'KB');
    console.log('');
    console.log('   Prod: src/assets/audios/level3/... (import ile bundle). Public yedek.');
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

generateAndSave();
