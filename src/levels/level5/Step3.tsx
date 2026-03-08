import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { awardPoints, logStudentAction, updateSessionCompletedLevels, saveScore, completeStory } from '../../lib/supabase';
import { useStepContext } from '../../contexts/StepContext';
import type { RootState } from '../../store/store';
import { useAudioPlaybackRate } from '../../hooks/useAudioPlaybackRate';
import { playSoundEffect } from '../../lib/soundEffects';
import PointsAnimation from '../../components/PointsAnimation';
import { Award, CheckCircle, Star, Unlock, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

type Phase = 'loading' | 'summary' | 'unlocking' | 'complete';

// Tüm stratejiler (spec'e göre)
const ALL_STRATEGIES = [
  { id: 'preview', name: 'Metni Gözden Geçirme', emoji: '👀', level: 1 },
  { id: 'predict', name: 'Tahminde Bulunma', emoji: '🔮', level: 1 },
  { id: 'repeat', name: 'Tekrarlı Okuma', emoji: '🔄', level: 2 },
  { id: 'model', name: 'Model Okuma', emoji: '🎯', level: 2 },
  { id: 'goal', name: 'Seçenek Sunma ve Hedef Belirleme', emoji: '🎯', level: 3 },
  { id: 'feedback', name: 'Performans Geribildirimi', emoji: '📊', level: 3 },
  { id: 'schema', name: 'Şematik Düzenleyicilerden Yararlanma', emoji: '🗺️', level: 4 },
  { id: 'brainstorm', name: 'Beyin Fırtınası Yapma ve Yorumda Bulunma', emoji: '💡', level: 4 },
  { id: 'summarize', name: 'Özetleme', emoji: '📝', level: 4 },
  { id: 'comprehension', name: 'Okuduğunu Anlama Soruları', emoji: '❓', level: 5 },
  { id: 'reward', name: 'Hedefe Bağlı Ödül', emoji: '🏆', level: 5 },
];

export default function L5Step3() {
  const student = useSelector((state: RootState) => state.user.student);
  const { sessionId, storyId, onStepCompleted } = useStepContext();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [phase, setPhase] = useState<Phase>('loading');
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [animatedStrategies, setAnimatedStrategies] = useState<string[]>([]);
  const [unlockAnimation, setUnlockAnimation] = useState(false);
  const [totalSessionPoints, setTotalSessionPoints] = useState(0);
  
  useAudioPlaybackRate(audioRef);

  // Load session data
  useEffect(() => {
    if (!student || !sessionId) return;

    const loadData = async () => {
      try {
        // Simüle - gerçek uygulamada tüm oturum puanları toplanabilir
        setTotalSessionPoints(150); // Örnek değer
        setPhase('summary');
      } catch (err) {
        console.error('Error loading session data:', err);
        setPhase('summary');
      }
    };

    loadData();
  }, [student?.id, sessionId]);

  // Strateji animasyonu
  useEffect(() => {
    if (phase !== 'summary') return;

    // Her stratejiyi sırayla göster
    ALL_STRATEGIES.forEach((strategy, index) => {
      setTimeout(() => {
        setAnimatedStrategies(prev => [...prev, strategy.id]);
        if (index < 3) playSoundEffect('pop');
      }, index * 300);
    });

    // Tümü gösterildikten sonra ses çal
    setTimeout(() => {
      playSoundEffect('success');
    }, ALL_STRATEGIES.length * 300 + 500);
  }, [phase]);

  // Kilit açma animasyonu başlat
  const handleUnlock = async () => {
    setPhase('unlocking');
    setUnlockAnimation(true);
    playSoundEffect('success');

    // Session'ı tamamla
    if (student && sessionId && storyId) {
      // Mark session Level 5 as completed
      await updateSessionCompletedLevels(sessionId, [5]);
      
      // Log completion
      await logStudentAction(
        sessionId,
        student.id,
        'session_completed',
        storyId,
        5,
        3,
        { totalStrategies: ALL_STRATEGIES.length }
      );

      // Final points
      const { error } = await awardPoints(
        student.id,
        storyId,
        50,
        'Seviye 5 - Oturum tamamlandı'
      );
      saveScore(sessionId, student.id, storyId, 5, 3, 'level_complete', 50, undefined, { reason: 'Seviye 5 - Oturum tamamlandı' }).catch(console.error);

      if (!error) {
        setEarnedPoints(50);
        setShowPointsAnimation(true);
        setTimeout(() => setShowPointsAnimation(false), 2000);
        window.dispatchEvent(new Event('progressUpdated'));
      }
    }

    // Hikayeyi tamamla – bir sonraki hikaye kilidi açılsın (sessionId yoksa da çalışır)
    if (student && storyId) {
      await completeStory(student.id, storyId);
    }
    if (onStepCompleted) {
      await onStepCompleted({
        sessionCompleted: true,
        storyCompleted: true,
        strategiesUsed: ALL_STRATEGIES.length
      });
    }

    // 2 saniye sonra tamamlandı fazına geç
    setTimeout(() => {
      setPhase('complete');
    }, 2000);
  };

  // Oturum seçimine dön
  const handleGoToSessions = () => {
    navigate('/story-completion/' + storyId);
  };

  // Loading
  if (phase === 'loading') {
    return (
      <div className="w-full max-w-3xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Oturum özeti hazırlanıyor...</p>
      </div>
    );
  }

  // Strateji özeti
  if (phase === 'summary') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <audio ref={audioRef} preload="auto" />
        <PointsAnimation show={showPointsAnimation} points={earnedPoints} />
        
        <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
          <Award className="w-7 h-7" />
          3. Adım: Çalışmayı Sonlandırma
        </h2>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* DOST Mesajı */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl p-6 mb-6 text-center">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold text-purple-800 mb-3">
              Harika Bir Çalışmaydı!
            </h3>
            <p className="text-lg text-gray-700">
              Bu oturumda birlikte birçok strateji kullandık. İşte öğrendiğin ve uyguladığın stratejiler:
            </p>
          </div>

          {/* Strateji Listesi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {ALL_STRATEGIES.map((strategy, index) => {
              const isVisible = animatedStrategies.includes(strategy.id);
              return (
                <div
                  key={strategy.id}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl
                    bg-gradient-to-r from-gray-50 to-gray-100
                    border-2 border-gray-200
                    transform transition-all duration-500
                    ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}
                  `}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <span className="text-2xl">{strategy.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{strategy.name}</p>
                    <p className="text-xs text-gray-500">Seviye {strategy.level}</p>
                  </div>
                  <CheckCircle className={`w-5 h-5 text-green-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              );
            })}
          </div>

          {/* Tebrik Mesajı */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-xl p-6 mb-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Star className="w-8 h-8 text-yellow-500 animate-pulse" />
              <h3 className="text-xl font-bold text-green-800">
                Tebrikler! Güzel bir çalışmaydı!
              </h3>
              <Star className="w-8 h-8 text-yellow-500 animate-pulse" />
            </div>
            <p className="text-gray-700">
              Bir sonraki oturumun kilidini açmayı başardın!
            </p>
          </div>

          {/* Kilit Aç Butonu */}
          <button
            onClick={handleUnlock}
            className="
              w-full py-4 rounded-xl font-bold text-xl
              bg-gradient-to-r from-yellow-400 to-orange-500
              hover:from-yellow-500 hover:to-orange-600
              text-white shadow-xl
              transform hover:scale-[1.02] transition-all
              flex items-center justify-center gap-3
            "
          >
            <Unlock className="w-6 h-6" />
            Sonraki Oturumun Kilidini Aç!
            <Sparkles className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  // Kilit açılıyor animasyonu
  if (phase === 'unlocking') {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <PointsAnimation show={showPointsAnimation} points={earnedPoints} />
        
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center relative overflow-hidden">
          {/* Kilit animasyonu */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className={`
              absolute inset-0 flex items-center justify-center
              text-8xl transition-all duration-1000
              ${unlockAnimation ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}
            `}>
              🔒
            </div>
            <div className={`
              absolute inset-0 flex items-center justify-center
              text-8xl transition-all duration-1000 delay-500
              ${unlockAnimation ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
            `}>
              🔓
            </div>
          </div>

          {/* Parıltı efekti */}
          {unlockAnimation && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-ping"
                  style={{
                    left: `${30 + Math.random() * 40}%`,
                    top: `${30 + Math.random() * 40}%`,
                    animationDelay: `${Math.random()}s`,
                    animationDuration: '1.5s'
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
          )}

          <h2 className="text-3xl font-bold text-purple-800 mb-2">
            {unlockAnimation ? 'Kilit Açıldı!' : 'Kilit Açılıyor...'}
          </h2>
          <p className="text-gray-600">
            Sonraki oturum artık hazır!
          </p>
        </div>
      </div>
    );
  }

  // Tamamlandı
  if (phase === 'complete') {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <PointsAnimation show={showPointsAnimation} points={earnedPoints} />
        
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl shadow-2xl p-8 text-white text-center">
          {/* Confetti efekti */}
          <div className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl animate-bounce">
              🎊
            </div>
          </div>

          <div className="mt-8 mb-6">
            <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-2">
              Oturum Tamamlandı!
            </h2>
            <p className="text-xl opacity-90">
              Muhteşem bir iş çıkardın! 🌟
            </p>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/20 rounded-xl p-4">
              <p className="text-sm opacity-80">Kullanılan Strateji</p>
              <p className="text-3xl font-bold">{ALL_STRATEGIES.length}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <p className="text-sm opacity-80">Kazanılan Puan</p>
              <p className="text-3xl font-bold">+50</p>
            </div>
          </div>

          {/* Oturum Seçimine Git */}
          <button
            onClick={handleGoToSessions}
            className="
              w-full py-4 rounded-xl font-bold text-xl
              bg-white text-purple-600
              hover:bg-gray-100
              shadow-xl
              transform hover:scale-[1.02] transition-all
              flex items-center justify-center gap-3
            "
          >
            <BookOpen className="w-6 h-6" />
            Oturumları Görüntüle
            <ArrowRight className="w-6 h-6" />
          </button>

          <p className="text-sm opacity-75 mt-4">
            Bir sonraki oturumda görüşmek üzere! 👋
          </p>
        </div>
      </div>
    );
  }

  return null;
}
