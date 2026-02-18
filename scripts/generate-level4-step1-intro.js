/**
 * 4. Seviye 1. Adım – Giriş yönergesi ses dosyası.
 * DOST: "Şimdi dördüncü seviyeye geçiyoruz. Sırada bu metni özetleme var..."
 * Çıktı: public/audios/level4/seviye-4-adim-1.mp3 ve src/assets/audios/level4/
 *
 * Kullanım: node scripts/generate-level4-step1-intro.js
 */
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VOICE_API_URL = 'https://arge.muhbirai.com/webhook/dost/voice-generator';

const TEXT =
  'Şimdi dördüncü seviyeye geçiyoruz. Sırada bu metni özetleme var. Metinde geçen önemli bilgi birimlerini söyleyerek metni önce ben özetleyeceğim sonra da aynı şekilde sen özetleyeceksin. Özetleme yaparken önemli bilgi birimlerine ve metnin içeriğinin akış sırasına çok dikkat etmen gerekiyor. Bunu kolayca yapabilmen için senin için oluşturduğum şemayı ekrandan takip etmen gerekiyor. Şimdi ben özetlemeye başlıyorum. Lütfen sen de ilgili yerlere bakarak takip etmeye başla.';

const OUTPUT_FILE = 'seviye-4-adim-1.mp3';
const PUBLIC_DIR = join(__dirname, '..', 'public', 'audios', 'level4');
const ASSETS_DIR = join(__dirname, '..', 'src', 'assets', 'audios', 'level4');

async function generateAndSave() {
  console.log('🎤 4. Seviye 1. Adım – giriş sesi oluşturuluyor...');
  console.log('📝 Metin uzunluğu:', TEXT.length, 'karakter');
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
    console.log('   Uygulama getAssetUrl ile public/audios/level4/... kullanıyor.');
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

generateAndSave();
