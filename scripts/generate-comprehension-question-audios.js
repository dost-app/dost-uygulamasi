import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Voice generator API endpoint
const VOICE_API_URL = 'https://arge.muhbirai.com/webhook/dost/voice-generator';

// Base64 string'i buffer'a çevir
function base64ToBuffer(base64String) {
  return Buffer.from(base64String, 'base64');
}

// API'ye istek gönder (fetch kullanarak)
async function generateAudio(text, timeout = 30000) {
  try {
    console.log(`   🔗 API'ye istek gönderiliyor...`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(VOICE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log(`   📡 API yanıt durumu: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned ${response.status}: ${errorText.substring(0, 200)}`);
    }

    const contentType = response.headers.get('content-type');
    console.log(`   📄 Content-Type: ${contentType}`);

    if (!contentType || !contentType.includes('application/json')) {
      const errorText = await response.text();
      throw new Error(`Expected JSON but got ${contentType}: ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    
    if (!data.audioBase64) {
      throw new Error('API response does not contain audioBase64');
    }

    console.log(`   ✅ Ses dosyası alındı (${data.audioBase64.length} karakter)`);
    return data.audioBase64;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`API isteği zaman aşımına uğradı (${timeout}ms)`);
    }
    throw error;
  }
}

// Ses dosyasını kaydet
function saveAudioFile(audioBase64, filePath) {
  const audioBuffer = base64ToBuffer(audioBase64);
  const dir = path.dirname(filePath);
  
  // Klasör yoksa oluştur
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, audioBuffer);
  console.log(`   💾 Dosya kaydedildi: ${filePath}`);
}

// Soru için ses dosyaları oluştur
async function generateQuestionAudios(storyId, questionId, questionData) {
  const outputDir = path.join(__dirname, '..', 'public', 'audios', 'sorular');
  
  // Klasör yoksa oluştur
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = [];
  const errors = [];

  try {
    // 1. Soru seslendirmesi
    console.log(`\n📝 Soru ${questionId} - Soru metni seslendiriliyor...`);
    try {
      const questionAudio = await generateAudio(questionData.question_text);
      const questionPath = path.join(outputDir, `question-${storyId}-${questionId}.mp3`);
      saveAudioFile(questionAudio, questionPath);
      files.push({ type: 'question', path: questionPath });
    } catch (err) {
      console.error(`   ❌ Soru seslendirmesi hatası:`, err.message);
      errors.push({ type: 'question', error: err.message });
    }

    // 2. Şıkların seslendirmesi (A, B, C, D)
    const options = [
      { key: 'A', text: questionData.option_a },
      { key: 'B', text: questionData.option_b },
      { key: 'C', text: questionData.option_c },
      { key: 'D', text: questionData.option_d },
    ];

    for (const option of options) {
      console.log(`\n📝 Soru ${questionId} - Şık ${option.key} seslendiriliyor...`);
      try {
        const optionText = `${option.key}. ${option.text}`;
        const optionAudio = await generateAudio(optionText);
        const optionPath = path.join(outputDir, `option-${storyId}-${questionId}-${option.key}.mp3`);
        saveAudioFile(optionAudio, optionPath);
        files.push({ type: `option-${option.key}`, path: optionPath });
      } catch (err) {
        console.error(`   ❌ Şık ${option.key} seslendirmesi hatası:`, err.message);
        errors.push({ type: `option-${option.key}`, error: err.message });
      }
    }

    // 3. Doğru cevap seslendirmesi
    console.log(`\n📝 Soru ${questionId} - Doğru cevap seslendirmesi oluşturuluyor...`);
    try {
      const correctOption = options.find(opt => opt.key === questionData.correct_option);
      const correctText = `Tebrikler, doğru cevap. ${correctOption.key}. ${correctOption.text}`;
      const correctAudio = await generateAudio(correctText);
      const correctPath = path.join(outputDir, `correct-${storyId}-${questionId}.mp3`);
      saveAudioFile(correctAudio, correctPath);
      files.push({ type: 'correct', path: correctPath });
    } catch (err) {
      console.error(`   ❌ Doğru cevap seslendirmesi hatası:`, err.message);
      errors.push({ type: 'correct', error: err.message });
    }

    // 4. Yanlış cevap seslendirmesi
    console.log(`\n📝 Soru ${questionId} - Yanlış cevap seslendirmesi oluşturuluyor...`);
    try {
      const correctOption = options.find(opt => opt.key === questionData.correct_option);
      const wrongText = `Yanlış cevap. Doğru cevap ${correctOption.key}. ${correctOption.text} olacaktı.`;
      const wrongAudio = await generateAudio(wrongText);
      const wrongPath = path.join(outputDir, `wrong-${storyId}-${questionId}.mp3`);
      saveAudioFile(wrongAudio, wrongPath);
      files.push({ type: 'wrong', path: wrongPath });
    } catch (err) {
      console.error(`   ❌ Yanlış cevap seslendirmesi hatası:`, err.message);
      errors.push({ type: 'wrong', error: err.message });
    }

    return { files, errors };
  } catch (err) {
    console.error(`❌ Soru ${questionId} için genel hata:`, err);
    throw err;
  }
}

// Ana fonksiyon
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 6) {
    console.error('Kullanım: node generate-comprehension-question-audios.js <storyId> <questionId> <questionText> <optionA> <optionB> <optionC> <optionD> <correctOption>');
    console.error('Örnek: node generate-comprehension-question-audios.js 3 q1 "Karıncalar nasıl yaşar?" "Tek başlarına" "Küçük gruplar halinde" "Büyük şehirlerde" "Sadece ağaçlarda" B');
    process.exit(1);
  }

  const [storyId, questionId, questionText, optionA, optionB, optionC, optionD, correctOption] = args;

  console.log('🎵 Okuduğunu Anlama Soruları Ses Dosyası Oluşturucu');
  console.log('='.repeat(60));
  console.log(`📚 Hikaye ID: ${storyId}`);
  console.log(`❓ Soru ID: ${questionId}`);
  console.log(`📝 Soru: ${questionText}`);
  console.log(`A) ${optionA}`);
  console.log(`B) ${optionB}`);
  console.log(`C) ${optionC}`);
  console.log(`D) ${optionD}`);
  console.log(`✅ Doğru Cevap: ${correctOption}`);
  console.log('='.repeat(60));

  const questionData = {
    question_text: questionText,
    option_a: optionA,
    option_b: optionB,
    option_c: optionC,
    option_d: optionD,
    correct_option: correctOption.toUpperCase(),
  };

  try {
    const result = await generateQuestionAudios(storyId, questionId, questionData);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ İşlem Tamamlandı!');
    console.log(`📁 Oluşturulan dosyalar: ${result.files.length}`);
    if (result.errors.length > 0) {
      console.log(`⚠️  Hatalar: ${result.errors.length}`);
      result.errors.forEach(err => {
        console.log(`   - ${err.type}: ${err.error}`);
      });
    }
    console.log('='.repeat(60));
  } catch (err) {
    console.error('\n❌ Genel hata:', err);
    process.exit(1);
  }
}

export { generateQuestionAudios };

