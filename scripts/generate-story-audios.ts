import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FALLBACK_STORIES, type Paragraph } from '../src/data/fallback-stories-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VOICE_API_URL = 'https://arge.muhbirai.com/webhook/dost/voice-generator';

const LEVEL1_STEP3_ANALYSIS_TEXTS: Record<number, string> = {
  1: 'Bu ilk cümlelere bakınca metnin karıncaların nasıl yaşadığı, vücut yapısı ve beslenmesi hakkında bilgi verdiğini düşünüyorum. Şimdi sen de sarı renkle vurgulanan cümlelere bakarak kendi tahminini söyle.',
  2: 'Bu ilk cümlelere bakınca metnin akıllı telefonların kullanım amaçları, görünüşü ve çalışma şekli hakkında bilgi verdiğini düşünüyorum. Hadi şimdi sen de metnin nasıl devam ettiğini tahmin et.',
  3: 'Bu ilk cümlelere bakınca metnin hurma ağacının yaşam koşulları, görünüşü ve çoğalması hakkında bilgi verdiğini düşünüyorum. Şimdi sıra sende, sen de kendi tahminini paylaş.',
  4: 'Bu ilk cümlelere bakınca metnin Akdeniz Bölgesi nin iklimi, bitki örtüsü ve yeryüzü şekilleri hakkında bilgi verdiğini düşünüyorum. Sen de diğer ilk cümlelere bakıp devamını tahmin et.',
  5: 'Bu ilk cümlelere bakınca metnin develerin nasıl yaşadığı, fiziksel özellikleri ve beslenmesi hakkında bilgi verdiğini düşünüyorum. Hadi şimdi sen de metnin geri kalanını tahmin etmeye çalış.',
  6: 'Bu ilk cümlelere bakınca metnin sanal gerçeklik gözlüklerinin ne işe yaradığı, nasıl göründüğü ve nasıl çalıştığı hakkında bilgi verdiğini düşünüyorum. Şimdi sen de diğer cümlelere bakarak kendi tahminini söyle.',
  7: 'Bu ilk cümlelere bakınca metnin kaktüslerin yaşam koşulları, fiziksel özellikleri ve çevreye etkileri hakkında bilgi verdiğini düşünüyorum. Şimdi sen de devamını tahmin etmeye çalış.',
  8: 'Bu ilk cümlelere bakınca metnin Doğu Anadolu Bölgesi nin iklimi, bitki örtüsü ve yeryüzü şekilleri hakkında bilgi verdiğini düşünüyorum. Şimdi sıra sende, sen de tahminini söyle.',
  9: 'Bu ilk cümlelere bakınca metnin sincapların yaşayışları, fiziksel özellikleri ve beslenmeleri hakkında bilgi verdiğini düşünüyorum. Şimdi sen de metnin devamı hakkında tahmin yap.',
  10: 'Bu ilk cümlelere bakınca metnin akıllı saatlerin ne işe yaradığı, nasıl göründüğü ve nasıl çalıştığı hakkında bilgi verdiğini düşünüyorum. Hadi şimdi sen de tahminini söyle.',
  11: 'Bu ilk cümlelere bakınca metnin nar ağacının yaşam koşulları, görünüşü ve çoğalması hakkında bilgi verdiğini düşünüyorum. Şimdi sen de metnin nasıl devam edeceğini tahmin et.',
  12: 'Bu ilk cümlelere bakınca metnin Marmara Bölgesi nin iklimi, bitki örtüsü ve yeryüzü şekilleri hakkında bilgi verdiğini düşünüyorum. Şimdi sıra sende, sen de tahminini paylaş.',
  13: 'Bu ilk cümlelere bakınca metnin leyleklerin nasıl yaşadığı, fiziksel özellikleri ve beslenmesi hakkında bilgi verdiğini düşünüyorum. Şimdi sen de metnin devamını tahmin et.',
  14: 'Bu ilk cümlelere bakınca metnin robotların ne işe yaradığı, nasıl göründüğü ve nasıl çalıştığı hakkında bilgi verdiğini düşünüyorum. Hadi şimdi sen de tahminini söyle.',
  15: 'Bu ilk cümlelere bakınca metnin sinekkapan bitkisinin yaşam koşulları, görünüşü ve çoğalması hakkında bilgi verdiğini düşünüyorum. Şimdi sen de kendi tahminini paylaş.',
  16: 'Bu ilk cümlelere bakınca metnin Ege Bölgesi nin iklimi, bitki örtüsü ve yeryüzü şekilleri hakkında bilgi verdiğini düşünüyorum. Şimdi sıra sende, sen de tahminini söyle.',
  17: 'Bu ilk cümlelere bakınca metnin maymunların nasıl yaşadığı, fiziksel özellikleri ve beslenmesi hakkında bilgi verdiğini düşünüyorum. Hadi şimdi sen de metnin devamını tahmin et.',
  18: 'Bu ilk cümlelere bakınca metnin üç boyutlu yazıcıların ne işe yaradığı, nasıl göründüğü ve nasıl çalıştığı hakkında bilgi verdiğini düşünüyorum. Şimdi sen de diğer cümlelere bakarak tahminini söyle.',
  19: 'Bu ilk cümlelere bakınca metnin çileğin yaşam koşulları, görünüşü ve çoğalması hakkında bilgi verdiğini düşünüyorum. Şimdi sen de metnin nasıl devam edeceğini tahmin et.',
  20: 'Bu ilk cümlelere bakınca metnin Karadeniz Bölgesi nin iklimi, bitki örtüsü ve yeryüzü şekilleri hakkında bilgi verdiğini düşünüyorum. Şimdi sıra sende, sen de tahminini paylaş.',
  21: 'Bu ilk cümlelere bakınca metnin ahtapotların nasıl yaşadığı, fiziksel özellikleri ve beslenmesi hakkında bilgi verdiğini düşünüyorum. Hadi şimdi sen de devamını tahmin etmeye çalış.',
  22: 'Bu ilk cümlelere bakınca metnin tabletlerin ne işe yaradığı, nasıl göründüğü ve nasıl çalıştığı hakkında bilgi verdiğini düşünüyorum. Şimdi sen de tahminini söyle.',
  23: 'Bu ilk cümlelere bakınca metnin karpuzun yaşam koşulları, görünüşü ve çoğalması hakkında bilgi verdiğini düşünüyorum. Şimdi sen de metnin devamı hakkında tahmin yap.',
  24: 'Bu ilk cümlelere bakınca metnin Güneydoğu Anadolu Bölgesi nin iklimi, bitki örtüsü ve yeryüzü şekilleri hakkında bilgi verdiğini düşünüyorum. Şimdi sıra sende, sen de tahminini söyle.'
};

function paragraphToPlain(paragraph: Paragraph): string {
  return paragraph.map((segment) => segment.text).join('').replace(/\s+/g, ' ').trim();
}

async function generateAudio(text: string, timeout = 45000): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(VOICE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`API ${response.status}: ${body.slice(0, 200)}`);
    }

    const data = await response.json();
    const base64 = data.audioBase64 || data.audio || '';
    if (!base64) {
      throw new Error('audioBase64 bulunamadı');
    }
    return base64;
  } finally {
    clearTimeout(timeoutId);
  }
}

function saveBase64Audio(base64Audio: string, filePath: string) {
  const normalized = base64Audio.includes('data:')
    ? base64Audio.split(',')[1]
    : base64Audio;
  const buffer = Buffer.from(normalized, 'base64');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
}

async function generateLevel3ParagraphAudios(storyId: number) {
  const paragraphs = FALLBACK_STORIES[storyId];
  if (!paragraphs?.length) return;

  for (let i = 0; i < paragraphs.length; i++) {
    const text = paragraphToPlain(paragraphs[i]);
    const outputPath = path.join(
      __dirname,
      '..',
      'public',
      'audios',
      'story',
      String(storyId),
      `story-${storyId}-paragraf-${i + 1}.mp3`
    );

    console.log(`🎧 L3 Story ${storyId} paragraf ${i + 1}`);
    const audioBase64 = await generateAudio(text);
    saveBase64Audio(audioBase64, outputPath);
  }
}

async function generateLevel1Step3Audio(storyId: number) {
  const analysisText = LEVEL1_STEP3_ANALYSIS_TEXTS[storyId];
  if (!analysisText) {
    console.log(`⏭️ L1 Step3 için story ${storyId} sabit analiz metni yok, atlanıyor.`);
    return;
  }

  const outputPath = path.join(
    __dirname,
    '..',
    'public',
    'audios',
    'level1',
    'step3',
    `story-${storyId}-analysis.mp3`
  );

  console.log(`🎧 L1 Step3 Story ${storyId} analiz`);
  const audioBase64 = await generateAudio(analysisText);
  saveBase64Audio(audioBase64, outputPath);
}

async function main() {
  const startId = Number(process.argv[2] || 6);
  const endId = Number(process.argv[3] || 12);
  const level1Only = process.argv.includes('--level1-only');

  console.log(`Ses üretimi başlıyor: story ${startId} - ${endId}${level1Only ? ' (yalnızca L1 Step3)' : ''}`);

  for (let storyId = startId; storyId <= endId; storyId++) {
    console.log(`\n=== Story ${storyId} ===`);
    await generateLevel1Step3Audio(storyId);
    if (!level1Only) {
      await generateLevel3ParagraphAudios(storyId);
    }
  }

  console.log('\n✅ Tüm ses dosyaları oluşturuldu.');
}

main().catch((error) => {
  console.error('\n❌ Ses üretimi başarısız:', error);
  process.exit(1);
});
