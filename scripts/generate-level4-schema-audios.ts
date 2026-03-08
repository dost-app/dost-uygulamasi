import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SCHEMAS } from '../src/data/schemas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VOICE_API_URL = 'https://arge.muhbirai.com/webhook/dost/voice-generator';
const OUTPUT_ROOT = path.join(__dirname, '..', 'public', 'audios', 'level4');

type GenerateTarget = {
  storyId: number;
  sectionId: number;
  type: 'step1' | 'step2';
  text: string;
  outputPath: string;
};

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateAudio(text: string): Promise<Buffer> {
  const response = await fetch(VOICE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API returned ${response.status}: ${errorText.slice(0, 200)}`);
  }

  const data = await response.json() as { audioBase64?: string };
  if (!data.audioBase64) {
    throw new Error('API response does not contain audioBase64');
  }

  return Buffer.from(data.audioBase64, 'base64');
}

function getPromptText(sectionTitle: string): string {
  const titleWithoutNumber = sectionTitle.replace(/^\d+\.\s*/, '').trim().replace(/-/g, ' ');
  return `Hikayeyi okuduk, ${titleWithoutNumber} hakkında metinden aklında kalanları özetle ve mikrofona tıklayarak cevabını ver.`;
}

function getStep1Text(sectionTitle: string, items: string[]): string {
  return `${sectionTitle} ${items.join(' ')}`;
}

function buildTargets(startId: number, endId: number): GenerateTarget[] {
  const targets: GenerateTarget[] = [];

  for (let storyId = startId; storyId <= endId; storyId++) {
    const schema = SCHEMAS[storyId];
    if (!schema) {
      console.warn(`⚠️ Şema bulunamadı, atlanıyor: story ${storyId}`);
      continue;
    }

    for (const section of schema.sections) {
      targets.push({
        storyId,
        sectionId: section.id,
        type: 'step1',
        text: getStep1Text(section.title, section.items),
        outputPath: path.join(OUTPUT_ROOT, 'adim1', `schema-${storyId}-${section.id}.mp3`),
      });

      targets.push({
        storyId,
        sectionId: section.id,
        type: 'step2',
        text: getPromptText(section.title),
        outputPath: path.join(OUTPUT_ROOT, 'adim2', `schema-${storyId}-${section.id}-prompt.mp3`),
      });
    }
  }

  return targets;
}

async function main() {
  const startId = Number(process.argv[2] || '1');
  const endId = Number(process.argv[3] || String(startId));
  const force = process.argv.includes('--force');

  if (Number.isNaN(startId) || Number.isNaN(endId)) {
    throw new Error('Kullanım: npx tsx scripts/generate-level4-schema-audios.ts <startId> <endId> [--force]');
  }

  ensureDir(path.join(OUTPUT_ROOT, 'adim1'));
  ensureDir(path.join(OUTPUT_ROOT, 'adim2'));

  const targets = buildTargets(startId, endId);
  console.log(`🎯 ${startId}-${endId} için ${targets.length} ses dosyası kontrol edilecek`);

  let created = 0;
  let skipped = 0;

  for (const [index, target] of targets.entries()) {
    if (!force && fs.existsSync(target.outputPath)) {
      skipped++;
      console.log(`⏭️  [${index + 1}/${targets.length}] mevcut: ${path.basename(target.outputPath)}`);
      continue;
    }

    console.log(`🎤 [${index + 1}/${targets.length}] oluşturuluyor: ${path.basename(target.outputPath)}`);
    const buffer = await generateAudio(target.text);
    fs.writeFileSync(target.outputPath, buffer);
    created++;
    console.log(`✅ kaydedildi: ${target.outputPath}`);
  }

  console.log(`\nTamamlandı. Oluşturulan: ${created}, atlanan: ${skipped}`);
}

main().catch((error) => {
  console.error('❌ Ses üretimi başarısız:', error);
  process.exit(1);
});
