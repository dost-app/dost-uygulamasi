import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store/store';
import { useStepContext } from '../../contexts/StepContext';

const QUALITY_METRIC_LABELS: Record<string, string> = {
  speechRate: 'Okuma Hızı',
  correctWords: 'Doğru Sözcükler',
  punctuation: 'Noktalama',
  expressiveness: 'İfadeli Okuma',
};

export default function Level2Step2() {
  const analysisResult = useSelector((state: RootState) => state.level2.analysisResult);
  const navigate = useNavigate();
  const { onStepCompleted, storyId } = useStepContext();

  console.log('Step2: analysisResult from Redux:', analysisResult);

  // Mark step as completed when analysis result is available
  useEffect(() => {
    if (analysisResult && onStepCompleted) {
      onStepCompleted({
        analysisResult
      });
    }
  }, [analysisResult, onStepCompleted]);

  if (!analysisResult) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 min-h-96">
        <div className="text-center bg-yellow-50 border-2 border-yellow-300 rounded-lg p-8 max-w-md">
          <p className="text-xl text-gray-800 mb-4 font-semibold">⚠️ Henüz okuma analizi sonucu yok</p>
          <p className="text-gray-600 mb-6">Lütfen önce 1. Adımı tamamla.</p>
          <button
            onClick={() => navigate(`/level/2/step/1?storyId=${storyId}`)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition"
          >
            1. Adıma Git
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4">
      <div className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-purple-800 text-center">2. Adım: Okuma Performansı</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Overall Score */}
          <div className="md:col-span-2 lg:col-span-1 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">Okuma Performansı (bir dakikada okunan doğru sözcük sayısı)</h4>
            <p className="text-3xl font-bold text-blue-600">{Math.round(analysisResult?.readingSpeed?.correctWordsPerMinute ?? analysisResult?.overallScore ?? 0)}</p>
            {/* Yüzde hesabı: 107 kelime referans (4. sınıf ortalaması) */}
            {analysisResult?.readingSpeed?.correctWordsPerMinute && (
              <p className="text-sm text-gray-600 mt-2">
                Referans değere göre: <span className="font-bold text-blue-700">{Math.round((analysisResult.readingSpeed.correctWordsPerMinute / 107) * 100)}%</span>
                <span className="text-xs text-gray-500 block mt-1">(Referans: 107 kelime/dakika - 4. sınıf ortalaması)</span>
              </p>
            )}
          </div>

          {/* Reading Speed */}
          {analysisResult?.readingSpeed && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-bold text-green-900 mb-2">Okuma Performansı</h4>
              <p className="text-gray-700">Dakikadaki Sözcük: <span className="font-bold text-green-700">{Math.round(analysisResult.readingSpeed.wordsPerMinute || 0)}</span></p>
              <p className="text-gray-700">Doğru Sözcük/Dakika: <span className="font-bold text-green-700">{Math.round(analysisResult.readingSpeed.correctWordsPerMinute || 0)}</span></p>
            </div>
          )}

          {/* Word Count */}
          {analysisResult?.wordCount && (
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-bold text-purple-900 mb-2">Sözcük Sayıları</h4>
              <p className="text-gray-700">Orijinal: <span className="font-bold">{analysisResult.wordCount.original}</span></p>
              <p className="text-gray-700">Okunan: <span className="font-bold">{analysisResult.wordCount.spoken}</span></p>
              <p className="text-gray-700">Doğru: <span className="font-bold text-green-700">{analysisResult.wordCount.correct}</span></p>
            </div>
          )}

          {/* Quality Rules */}
          {analysisResult?.qualityRules && (
            <div className="md:col-span-2 lg:col-span-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-bold text-orange-900 mb-3">Kalite Değerlendirmesi</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(analysisResult.qualityRules).map(([key, rule]) => (
                  <div key={key} className="bg-white p-3 rounded border border-orange-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700 text-sm">{QUALITY_METRIC_LABELS[key] || key}</span>
                      <span className="font-bold text-orange-600">{(rule as any).score}%</span>
                    </div>
                    <p className="text-xs text-gray-600">{(rule as any).feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pronunciation - Okuma Doğruluğu */}
          {analysisResult?.pronunciation && (
            <div className="md:col-span-2 lg:col-span-2 p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-bold text-red-900 mb-2">Okuma Doğruluğu</h4>
              <p className="text-gray-700 mb-3">Doğruluk: <span className="font-bold text-red-600">{analysisResult.pronunciation.accuracy}%</span></p>
              {analysisResult.pronunciation.errors.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Doğru Sözcükler */}
                  <div>
                    <h5 className="text-sm font-bold text-green-800 mb-2">Doğru Sözcükler</h5>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {analysisResult.pronunciation.errors
                        .filter((error: any) => error.expected && !error.actual)
                        .map((error: any, idx: number) => (
                          <div key={idx} className="bg-white p-2 rounded text-sm border border-green-200">
                            <span className="text-green-700 font-medium">{error.expected}</span>
                          </div>
                        ))}
                      {analysisResult.pronunciation.errors.filter((e: any) => e.expected && !e.actual).length === 0 && (
                        <p className="text-xs text-gray-500 italic">Doğru okunan sözcük bulunmuyor</p>
                      )}
                    </div>
                  </div>
                  {/* Hatalı Sözcükler */}
                  <div>
                    <h5 className="text-sm font-bold text-red-800 mb-2">Hatalı Sözcükler</h5>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {analysisResult.pronunciation.errors
                        .filter((error: any) => error.expected && error.actual)
                        .map((error: any, idx: number) => {
                          // Türkçe karakterleri normalize et (basit yaklaşım)
                          const normalizeText = (text: string) => {
                            return text
                              .replace(/[ıİ]/g, 'i')
                              .replace(/[ğĞ]/g, 'g')
                              .replace(/[üÜ]/g, 'u')
                              .replace(/[şŞ]/g, 's')
                              .replace(/[öÖ]/g, 'o')
                              .replace(/[çÇ]/g, 'c');
                          };
                          const expectedNormalized = normalizeText(error.expected || '');
                          const actualNormalized = normalizeText(error.actual || '');
                          // Eğer normalize edilmiş hali aynıysa, orijinali göster
                          const displayExpected = expectedNormalized === actualNormalized ? error.expected : error.expected;
                          const displayActual = expectedNormalized === actualNormalized ? error.actual : error.actual;
                          
                          return (
                            <div key={idx} className="bg-white p-2 rounded text-sm border border-red-200">
                              <p>
                                <span className="text-red-600 font-bold">{displayExpected}</span>
                                {' → '}
                                <span className="text-red-500 font-medium">{displayActual}</span>
                              </p>
                            </div>
                          );
                        })}
                      {analysisResult.pronunciation.errors.filter((e: any) => e.expected && e.actual).length === 0 && (
                        <p className="text-xs text-gray-500 italic">Hatalı okunan sözcük bulunmuyor</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommendations - Sadece içerik varsa göster */}
          {analysisResult?.recommendations && analysisResult.recommendations.length > 0 && analysisResult.recommendations.some((rec: string) => rec && rec.trim().length > 0) && (
            <div className="md:col-span-2 lg:col-span-1 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="font-bold text-indigo-900 mb-2">Öneriler</h4>
              <ul className="space-y-2">
                {analysisResult.recommendations
                  .filter((rec: string) => rec && rec.trim().length > 0)
                  .map((rec, idx) => (
                    <li key={idx} className="text-gray-700 text-sm flex items-start">
                      <span className="text-indigo-600 font-bold mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Transcript - Renklendirilmiş */}
          {analysisResult?.transcript && (
            <div className="md:col-span-2 lg:col-span-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">Transkript</h4>
              <div className="text-gray-700 italic text-sm">
                {(() => {
                  const transcript = analysisResult.transcript || '';
                  const words = transcript.split(/\s+/);
                  const errorWords = new Set(
                    (analysisResult.pronunciation?.errors || [])
                      .filter((e: any) => e.actual)
                      .map((e: any) => e.actual.toLowerCase())
                  );
                  const correctWords = new Set(
                    (analysisResult.pronunciation?.errors || [])
                      .filter((e: any) => e.expected && !e.actual)
                      .map((e: any) => e.expected.toLowerCase())
                  );
                  
                  return (
                    <p>
                      "{words.map((word: string, idx: number) => {
                        const normalizedWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
                        const isError = errorWords.has(normalizedWord);
                        const isCorrect = correctWords.has(normalizedWord);
                        
                        return (
                          <span
                            key={idx}
                            className={isError ? 'text-red-600 font-semibold' : isCorrect ? 'text-blue-600 font-semibold' : ''}
                          >
                            {word}{idx < words.length - 1 ? ' ' : ''}
                          </span>
                        );
                      })}"
                    </p>
                  );
                })()}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <span className="text-blue-600 font-semibold">Mavi</span>: Doğru okunan kelimeler |{' '}
                <span className="text-red-600 font-semibold">Kırmızı</span>: Hatalı okunan kelimeler
              </p>
            </div>
          )}
        </div>

        {/* Navigation Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate(`/level/2/step/3?storyId=${storyId}`)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition"
          >
            Hedef Belirle →
          </button>
        </div>
      </div>
    </div>
  );
}
