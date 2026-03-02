import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getStepCompletionData, awardPoints, logStudentAction, supabase, saveScore } from '../../lib/supabase';
import { useStepContext } from '../../contexts/StepContext';
import type { RootState } from '../../store/store';
import { useAudioPlaybackRate } from '../../hooks/useAudioPlaybackRate';
import { playSoundEffect } from '../../lib/soundEffects';
import PointsAnimation from '../../components/PointsAnimation';
import VoiceRecorder from '../../components/VoiceRecorder';
import { generateRewardImage } from '../../lib/level5-api';
import { Trophy, Image, Music, BookOpen, Award, Sparkles, Download, CheckCircle, Lock } from 'lucide-react';
import { getAssetUrl } from '../../lib/image-utils';

type Phase = 'loading' | 'result' | 'reward-select' | 'reward-recording' | 'reward-generating' | 'reward-ready';
type GenerationStage = 'transcribing' | 'generating' | 'complete';

// Ödül seçenekleri - sadece görsel aktif
const REWARD_OPTIONS = [
  {
    id: 'image',
    title: 'Görsel Oluştur',
    description: 'Sesli olarak istediğin görseli anlatabilirsin',
    icon: Image,
    emoji: '🖼️',
    color: 'from-pink-500 to-rose-500',
    enabled: true,
    audioPath: getAssetUrl('audios/level5/step2-image-intro.mp3')
  },
  {
    id: 'song',
    title: 'Şarkı Yaz',
    description: 'İstediğin konuda sana şarkı yazabilirim',
    icon: Music,
    emoji: '🎵',
    color: 'from-purple-500 to-indigo-500',
    enabled: false,
    comingSoon: true
  },
  {
    id: 'story',
    title: 'Hikaye Oluştur',
    description: 'İstediğin karakterlerle hikaye yazabilirim',
    icon: BookOpen,
    emoji: '📖',
    color: 'from-blue-500 to-cyan-500',
    enabled: false,
    comingSoon: true
  },
  {
    id: 'badge',
    title: 'Rozet / Madalya',
    description: 'Dijital okuma rozeti veya madalya yapabilirim',
    icon: Award,
    emoji: '🏅',
    color: 'from-yellow-500 to-orange-500',
    enabled: false,
    comingSoon: true
  },
  {
    id: 'sticker',
    title: 'Sticker',
    description: 'İstediğin bir sticker görseli yapabilirim',
    icon: Sparkles,
    emoji: '✨',
    color: 'from-green-500 to-teal-500',
    enabled: false,
    comingSoon: true
  }
];

// Statik ses dosyaları
const AUDIO_FILES = {
  result: getAssetUrl('audios/level5/step2-result.mp3'),
  select: getAssetUrl('audios/level5/step2-select.mp3'),
  imageIntro: getAssetUrl('audios/level5/step2-image-intro.mp3'),
  recording: getAssetUrl('audios/level5/step2-recording.mp3'),
  generating: getAssetUrl('audios/level5/step2-generating.mp3'),
  ready: getAssetUrl('audios/level5/step2-ready.mp3'),
};

export default function L5Step2() {
  const student = useSelector((state: RootState) => state.user.student);
  const { sessionId, storyId, onStepCompleted } = useStepContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [phase, setPhase] = useState<Phase>('loading');
  const [l3Result, setL3Result] = useState<{ wpm: number; targetWPM: number } | null>(null);
  const [reachedGoal, setReachedGoal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [generationStage, setGenerationStage] = useState<GenerationStage>('transcribing');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [promptText, setPromptText] = useState<string>('');
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  useAudioPlaybackRate(audioRef);

  // Load Level 3 result
  useEffect(() => {
    if (!student) return;

    const loadL3Result = async () => {
      try {
        const completionData = await getStepCompletionData(student.id, storyId, 3, 2, sessionId);
        if (completionData && completionData.wpm !== undefined) {
          const result = completionData as { wpm: number; targetWPM: number };
          setL3Result(result);
          setReachedGoal(result.wpm >= result.targetWPM);
        } else {
          setReachedGoal(true);
        }
        setPhase('result');
      } catch (err) {
        console.error('Error loading Level 3 result:', err);
        setReachedGoal(true);
        setPhase('result');
      }
    };

    loadL3Result();
  }, [student?.id, storyId, sessionId]);

  // Sonuç gösterildiğinde ses çal
  useEffect(() => {
    if (phase === 'result' && audioRef.current) {
      audioRef.current.src = AUDIO_FILES.result;
      audioRef.current.play().catch(console.error);
      setTimeout(() => playSoundEffect(reachedGoal ? 'success' : 'pop'), 500);
    }
  }, [phase, reachedGoal]);

  // Ödül seçim fazında ses çal
  useEffect(() => {
    if (phase === 'reward-select' && audioRef.current) {
      audioRef.current.src = AUDIO_FILES.select;
      audioRef.current.play().catch(console.error);
    }
  }, [phase]);

  // Ödül seçimi
  const handleRewardSelect = (rewardId: string) => {
    const option = REWARD_OPTIONS.find(r => r.id === rewardId);
    if (!option?.enabled) return;

    setSelectedReward(rewardId);
    setPhase('reward-recording');
    
    // Açıklama sesi çal
    if (option.audioPath && audioRef.current) {
      audioRef.current.src = option.audioPath;
      audioRef.current.play().catch(console.error);
    }
  };

  // Ses kaydı alındı - görsel üret
  const handleVoiceSubmit = async (audioBlob: Blob) => {
    setPhase('reward-generating');
    setError(null);

    try {
      // Generating ses çal
      if (audioRef.current) {
        audioRef.current.src = AUDIO_FILES.generating;
        audioRef.current.play().catch(console.error);
      }

      // API call
      const { imageUrl, promptText: transcribedText } = await generateRewardImage(
        audioBlob,
        (stage) => setGenerationStage(stage)
      );

      setGeneratedImageUrl(imageUrl);
      setPromptText(transcribedText);

      // Supabase'e kaydet
      if (student && sessionId) {
        await supabase.from('student_rewards').insert({
          student_id: student.id,
          session_id: sessionId,
          story_id: storyId,
          reward_type: 'image',
          reward_url: imageUrl,
          prompt_text: transcribedText,
        });

        // Log action
        await logStudentAction(
          sessionId,
          student.id,
          'reward_generated',
          storyId,
          5,
          2,
          { rewardType: 'image', promptText: transcribedText }
        );
      }

      // Puan ver
      if (student && storyId) {
        const { error: pointsError } = await awardPoints(
          student.id,
          storyId,
          25,
          'Seviye 5 - Görsel ödülü oluşturuldu'
        );
        saveScore(sessionId, student.id, storyId, 5, 2, 'reward_created', 25, undefined, { reason: 'Görsel ödülü oluşturuldu' }).catch(console.error);
        if (!pointsError) {
          setEarnedPoints(25);
          setShowPointsAnimation(true);
          setTimeout(() => setShowPointsAnimation(false), 2000);
          window.dispatchEvent(new Event('progressUpdated'));
        }
      }

      setPhase('reward-ready');
      playSoundEffect('success');

      // Ready ses çal
      if (audioRef.current) {
        audioRef.current.src = AUDIO_FILES.ready;
        audioRef.current.play().catch(console.error);
      }

      // Step completion
      if (onStepCompleted) {
        await onStepCompleted({
          reachedGoal,
          rewardType: 'image',
          imageUrl,
          promptText: transcribedText,
          wpm: l3Result?.wpm,
          targetWPM: l3Result?.targetWPM
        });
      }
    } catch (err: any) {
      console.error('Reward generation error:', err);
      setError(err.message || 'Görsel oluşturulamadı. Lütfen tekrar deneyin.');
      setPhase('reward-recording');
    }
  };

  // İndir
  const handleDownload = async () => {
    if (!generatedImageUrl) return;
    
    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `dost-odul-${Date.now()}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('İndirme başarısız oldu. Görsele sağ tıklayıp "Resmi Farklı Kaydet" seçeneğini kullanabilirsin.');
    }
  };

  // Loading
  if (phase === 'loading') {
    return (
      <div className="w-full max-w-3xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Sonuçlar yükleniyor...</p>
      </div>
    );
  }

  // Sonuç gösterimi
  if (phase === 'result') {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <audio ref={audioRef} preload="auto" />
        <PointsAnimation show={showPointsAnimation} points={earnedPoints} />
        
        <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
          <Trophy className="w-7 h-7" />
          2. Adım: Hedefe Bağlı Ödül
        </h2>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Okuma Hızı Sonucu */}
          <div className={`text-center p-6 rounded-xl mb-6 ${
            reachedGoal 
              ? 'bg-gradient-to-r from-green-400 to-green-600' 
              : 'bg-gradient-to-r from-orange-400 to-orange-600'
          } text-white`}>
            <div className="text-6xl mb-4">{reachedGoal ? '🏆' : '💪'}</div>
            <h3 className="text-2xl font-bold mb-2">
              {reachedGoal ? 'Tebrikler! Hedefe Ulaştın!' : 'Bu Sefer Olmadı, Ama...'}
            </h3>
            
            {l3Result && (
              <div className="mt-4 bg-white/20 rounded-lg p-4 inline-block">
                <p className="text-lg">
                  Okuma Hızın: <span className="font-bold text-2xl">{l3Result.wpm}</span> kelime/dk
                </p>
                <p className="text-sm opacity-90">
                  (Hedef: {l3Result.targetWPM} kelime/dk)
                </p>
              </div>
            )}
          </div>

          {/* DOST Mesajı */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
            <p className="text-gray-800 text-lg leading-relaxed">
              {reachedGoal ? (
                <>
                  🎉 <strong>Hedefine ulaşarak ödülü hak ettin!</strong> Şimdi sana özel bir görsel oluşturabilirim. 
                  Hangi görseli istediğini sesli olarak anlatabilirsin!
                </>
              ) : (
                <>
                  💪 <strong>Bu sefer hedefe ulaşamadın ama üzülme!</strong> Pratik yaptıkça daha da iyileşeceksin. 
                  Seni motive etmek için yine de özel bir görsel oluşturalım!
                </>
              )}
            </p>
          </div>

          {/* Devam Butonu */}
          <button
            onClick={() => setPhase('reward-select')}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:shadow-lg transition-all"
          >
            Ödül Oluştur →
          </button>
        </div>
      </div>
    );
  }

  // Ödül seçimi
  if (phase === 'reward-select') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <audio ref={audioRef} preload="auto" />
        <PointsAnimation show={showPointsAnimation} points={earnedPoints} />
        
        <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
          <Trophy className="w-7 h-7" />
          2. Adım: Ödülünü Seç!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REWARD_OPTIONS.map((reward) => {
            const Icon = reward.icon;
            const isEnabled = reward.enabled;
            
            return (
              <button
                key={reward.id}
                onClick={() => isEnabled && handleRewardSelect(reward.id)}
                disabled={!isEnabled}
                className={`
                  relative p-6 rounded-2xl text-white shadow-xl
                  bg-gradient-to-br ${reward.color}
                  transform transition-all duration-300
                  flex flex-col items-center gap-3
                  border-4 border-white/30
                  ${isEnabled 
                    ? 'hover:scale-105 hover:shadow-2xl cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                  }
                `}
              >
                {!isEnabled && reward.comingSoon && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Yakında
                  </div>
                )}
                <span className="text-5xl">{reward.emoji}</span>
                <Icon className="w-8 h-8 opacity-80" />
                <h3 className="text-xl font-bold">{reward.title}</h3>
                <p className="text-sm opacity-90 text-center">{reward.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Ses kayıt fazı
  if (phase === 'reward-recording') {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <audio ref={audioRef} preload="auto" />
        <PointsAnimation show={showPointsAnimation} points={earnedPoints} />
        
        <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
          <Trophy className="w-7 h-7" />
          2. Adım: Görsel Oluştur
        </h2>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <span className="text-6xl mb-4 block">🖼️</span>
            <h3 className="text-xl font-bold text-gray-800 mb-2">İstediğin Görseli Anlat</h3>
            <p className="text-gray-600">
              Mikrofon düğmesine basıp hangi görseli istediğini sesli olarak anlat. 
              Örneğin: "Uzayda uçan renkli bir kedi"
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-300 rounded-xl p-4 mb-6 text-red-800">
              ⚠️ {error}
            </div>
          )}

          <VoiceRecorder
            onSave={handleVoiceSubmit}
            recordingDurationMs={15000}
            autoSubmit={true}
            storyId={storyId}
            level={5}
            step={2}
          />

          <button
            onClick={() => {
              setPhase('reward-select');
              setSelectedReward(null);
              setError(null);
            }}
            className="mt-4 w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-all"
          >
            ← Geri
          </button>
        </div>
      </div>
    );
  }

  // Ödül oluşturuluyor
  if (phase === 'reward-generating') {
    const stageMessages = {
      transcribing: 'Sesini dinliyorum... 🎧',
      generating: 'Görseli oluşturuyorum... 🎨',
      complete: 'Hazır! ✨'
    };

    return (
      <div className="w-full max-w-3xl mx-auto text-center py-12">
        <audio ref={audioRef} preload="auto" />
        <PointsAnimation show={showPointsAnimation} points={earnedPoints} />
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="animate-bounce text-6xl mb-4">✨</div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-2xl font-bold text-purple-800 mb-2">
            {stageMessages[generationStage]}
          </h3>
          <p className="text-gray-600">Senin için özel bir görsel hazırlıyorum!</p>
          <p className="text-sm text-gray-500 mt-4">Bu işlem 10-30 saniye sürebilir...</p>
        </div>
      </div>
    );
  }

  // Ödül hazır
  if (phase === 'reward-ready') {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <audio ref={audioRef} preload="auto" />
        <PointsAnimation show={showPointsAnimation} points={earnedPoints} />
        
        <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
          <CheckCircle className="w-7 h-7 text-green-500" />
          Ödülün Hazır!
        </h2>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <span className="text-6xl mb-4 block">🎉</span>
            <h3 className="text-xl font-bold text-gray-800 mb-2">İşte Senin Özel Görselin!</h3>
            {promptText && (
              <p className="text-gray-600 italic">"{promptText}"</p>
            )}
          </div>

          {/* Ödül görseli */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            {generatedImageUrl && (
              <img 
                src={generatedImageUrl} 
                alt="Oluşturulan ödül görseli" 
                className="max-w-full mx-auto rounded-xl shadow-lg"
              />
            )}
          </div>

          {/* İndir butonu */}
          <button
            onClick={handleDownload}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 mb-4"
          >
            <Download className="w-5 h-5" />
            Görseli İndir
          </button>

          <p className="text-center text-gray-500 text-sm">
            Ödülün "Profilim" bölümündeki galeride kayıtlı! Sonraki adıma geçebilirsin.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
