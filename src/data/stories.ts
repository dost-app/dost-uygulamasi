import { getStoryParagraphs } from '../lib/supabase';
import { FALLBACK_STORIES, type Paragraph, type TextSegment } from './fallback-stories-data';

export type { TextSegment, Paragraph };

export type StoryCategory =
  | 'Hayvanlarla ilgili metinler'
  | 'Bitkilerle ilgili metinler'
  | 'Elektronik araçlarla ilgili metinler'
  | 'Coğrafi Bölgelerle İlgili ilgili metinler';

// Re-export for seed script and tests
export { FALLBACK_STORIES };

// (FALLBACK_STORIES verisi fallback-stories-data.ts içinde; Supabase yokken veya seed için tek kaynak.)
const STORY_CATEGORIES: Record<number, StoryCategory> = {
  1: 'Hayvanlarla ilgili metinler',
  2: 'Elektronik araçlarla ilgili metinler',
  3: 'Bitkilerle ilgili metinler',
  4: 'Coğrafi Bölgelerle İlgili ilgili metinler',
  5: 'Hayvanlarla ilgili metinler',
};

// Cache for fetched paragraphs
const paragraphCache: Map<number, Paragraph[]> = new Map();

export const getParagraphs = (storyId: number): Paragraph[] => {
  if (paragraphCache.has(storyId)) {
    return paragraphCache.get(storyId) || [];
  }

  const fallback = FALLBACK_STORIES[storyId] || [];
  paragraphCache.set(storyId, fallback);
  return fallback;
};

export const getParagraphsAsync = async (storyId: number): Promise<Paragraph[]> => {
  if (paragraphCache.has(storyId)) {
    return paragraphCache.get(storyId) || [];
  }

  const { data, error } = await getStoryParagraphs(storyId);

  if (error || !data) {
    console.warn(`Failed to fetch paragraphs for story ${storyId}, using fallback data`);
    const fallback = FALLBACK_STORIES[storyId] || [];
    paragraphCache.set(storyId, fallback);
    return fallback;
  }

  const paragraphs: Paragraph[] = data
    .sort((a, b) => a.paragraph_index - b.paragraph_index)
    .map((p) => p.text_segments as TextSegment[]);

  paragraphCache.set(storyId, paragraphs);
  return paragraphs;
};

export const getStoryCategory = (storyId: number): StoryCategory | null =>
  STORY_CATEGORIES[storyId] || null;

export type ComprehensionQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type ComprehensionQuestions = Record<number, ComprehensionQuestion[]>;

const COMPREHENSION_QUESTIONS: ComprehensionQuestions = {
  1: [
    {
      question: 'Karıncalar nasıl yaşar?',
      options: ['Tek başlarına', 'Küçük gruplar halinde yuvalarda', 'Büyük şehirlerde', 'Sadece ağaçlarda'],
      correctIndex: 1
    },
    {
      question: 'Karıncaların kaç ayağı vardır?',
      options: ['Dört', 'Altı', 'Sekiz', 'On'],
      correctIndex: 1
    },
    {
      question: 'Karıncalar genellikle ne yer?',
      options: ['Et', 'Şekerli yiyecekler ve bitkiler', 'Sadece meyve', 'Sadece sebze'],
      correctIndex: 1
    },
    {
      question: 'Kraliçe karınca yılda kaç yumurta yapabilir?',
      options: ['10 milyon', '50 milyon', '100 milyon', '5 milyon'],
      correctIndex: 1
    },
    {
      question: 'Karıncaların çevreye olumlu etkisi nedir?',
      options: ['Toprağı havalandırır', 'Ağaçlara zarar verir', 'İnsanları ısırır', 'Hastalık yayar'],
      correctIndex: 0
    }
  ],
  2: [
    {
      question: 'Akıllı telefonların temel kullanım amacı nedir?',
      options: ['Sadece oyun oynamak', 'İletişim kurmak ve bilgiye erişmek', 'Sadece fotoğraf çekmek', 'Sadece müzik dinlemek'],
      correctIndex: 1
    },
    {
      question: 'Telefonlar genellikle hangi şekildedir?',
      options: ['Yuvarlak', 'Dikdörtgen', 'Üçgen', 'Kare'],
      correctIndex: 1
    },
    {
      question: 'Telefonlar nasıl çalışır?',
      options: ['Sadece batarya ile', 'Elektrik enerjisi ve batarya ile', 'Sadece güneş enerjisi ile', 'Sadece rüzgar enerjisi ile'],
      correctIndex: 1
    },
    {
      question: 'Telefonlar nerede üretilir?',
      options: ['Evde', 'Özel fabrikalarda', 'Okullarda', 'Parklarda'],
      correctIndex: 1
    },
    {
      question: 'Aşırı telefon kullanımı neye yol açabilir?',
      options: ['Göz sağlığını etkileyebilir', 'Hiçbir şeye yol açmaz', 'Sadece iyi şeylere yol açar', 'Sadece kulak sağlığını etkiler'],
      correctIndex: 0
    }
  ],
  3: [
    {
      question: 'Hurma ağaçları için en uygun yetişme ortamı hangisidir?',
      options: ['Ilıman orman içleri', 'Çöl ve çok sıcak iklimler', 'Sürekli soğuk bölgeler', 'Dağ etekleri'],
      correctIndex: 1
    },
    {
      question: 'Metne göre hurma ağacının görünümü nasıldır?',
      options: ['Kısa ve dallı gövde', 'Çalı formunda, yer seviyesinde', 'Uzun gövdeli, palmiye benzeri yapı', 'Yere yayılan sarmaşık'],
      correctIndex: 2
    },
    {
      question: 'Hurma ağacı çoğaltılırken hangi yöntemler kullanılabilir?',
      options: ['Sadece yaprakla çoğaltma', 'Yalnızca aşılama', 'Tohumla çoğaltma dışında yöntem yoktur', 'Çekirdeklerinin ekilmesi ya da gövdeden çıkan filizlerin dikilmesi'],
      correctIndex: 3
    },
    {
      question: 'Metne göre hurma yaprağının insan sağlığına ne gibi bir faydası vardır?',
      options: ['Ağızda çiğnendiğinde diş sağlığını koruması', 'Sindirimi hızlandırması', 'Kansere karşı koruması', 'Ateşi düşürmesi'],
      correctIndex: 0
    },
    {
      question: 'Metne göre hurma meyvesinin aşırı tüketimi hangi olumsuz etkiyi verebilir?',
      options: ['Ciddi görme sorunları', 'Baş ağrısı', 'Deride soyulma', 'Kalp ritim bozukluğu'],
      correctIndex: 1
    },
    {
      question: '"Çöl şekerlemesi" ifadesi hurmayı tanımlarken hangi iki özelliğine vurgu yapar?',
      options: ['Şekli ve boyutu', 'Rengi ve kokusu', 'Yetiştiği yer ve tadı', 'Fiyatı ve bulunurluğu'],
      correctIndex: 2
    },
    {
      question: 'Metinde hurmanın Ramazan Ayı\'nda sık tüketildiği ifade edilmektedir. Bunun sebebi ne olabilir?',
      options: ['Besin değerlerinin yüksek olması ve uzun süre tok tutması', 'Pişirilmeden tüketilebilmesi', 'Sadece sıcak iklimlerde yetişmesi', 'Diğer meyvelerden daha ucuz olması'],
      correctIndex: 0
    }
  ],
  4: [
    {
      question: 'Akdeniz Bölgesi\'nde hangi iklim görülür?',
      options: ['Karasal iklim', 'Akdeniz iklimi', 'Kutup iklimi', 'Tropikal iklim'],
      correctIndex: 1
    },
    {
      question: 'Akdeniz Bölgesi\'nin bitki örtüsü nedir?',
      options: ['Orman', 'Maki', 'Çöl', 'Tundra'],
      correctIndex: 1
    },
    {
      question: 'Akdeniz Bölgesi\'nin yeryüzü özelliği nasıldır?',
      options: ['Düz', 'Dağlık ve engebeli', 'Sadece ovalar', 'Sadece platolar'],
      correctIndex: 1
    },
    {
      question: 'Akdeniz Bölgesi\'nin başlıca gelir kaynağı nedir?',
      options: ['Sadece tarım', 'Tarım ve turizm', 'Sadece sanayi', 'Sadece balıkçılık'],
      correctIndex: 1
    },
    {
      question: 'Akdeniz Bölgesi\'nin nüfusu yaklaşık kaçtır?',
      options: ['5 milyon', '11 milyon', '20 milyon', '30 milyon'],
      correctIndex: 1
    }
  ],
  5: [
    {
      question: 'Develer genellikle nerede yaşar?',
      options: ['Kutup bölgelerinde', 'Çöl ikliminde', 'Ormanlarda', 'Deniz kenarında'],
      correctIndex: 1
    },
    {
      question: 'Develer kaç hörgüçlü olabilir?',
      options: ['Sadece tek hörgüçlü', 'Tek veya çift hörgüçlü', 'Sadece çift hörgüçlü', 'Hiç hörgüçsüz'],
      correctIndex: 1
    },
    {
      question: 'Develer ne tür hayvanlardır?',
      options: ['Etçil', 'Otçul', 'Hem etçil hem otçul', 'Sadece meyve yiyen'],
      correctIndex: 1
    },
    {
      question: 'Develer tek seferde ne kadar su içebilir?',
      options: ['10-20 litre', '80-90 litre', '5-10 litre', '100-150 litre'],
      correctIndex: 1
    },
    {
      question: 'Develer nasıl çoğalır?',
      options: ['Yumurtlayarak', 'Doğurarak', 'Bölünerek', 'Tomurcuklanarak'],
      correctIndex: 1
    }
  ]
};

export const getComprehensionQuestions = (
  storyId: number
): ComprehensionQuestion[] => {
  return COMPREHENSION_QUESTIONS[storyId] || [];
};

export const paragraphToPlain = (p: Paragraph) =>
  p.map((s) => s.text).join('');

export const getFirstSentence = (text: string): string => {
  const match = text.match(/[^.!?\n]+[.!?]?/);
  return match ? match[0].trim() : text.trim();
};

export const getFirstThreeParagraphFirstSentences = async (
  storyId: number
): Promise<string[]> => {
  const paras = await getParagraphsAsync(storyId);
  const firstThree = paras.slice(0, 3).map(paragraphToPlain);
  return firstThree.map(getFirstSentence).filter(Boolean);
};

export const getFullText = async (storyId: number): Promise<string> => {
  const paras = await getParagraphsAsync(storyId);
  const plainTexts = paras.map(paragraphToPlain);
  return plainTexts.join('\n\n');
};

export const getParagraphCount = (storyId: number): number => {
  const paragraphs = getParagraphs(storyId);
  return paragraphs.length;
};

export const getParagraphCountAsync = async (storyId: number): Promise<number> => {
  const paragraphs = await getParagraphsAsync(storyId);
  return paragraphs.length;
};
