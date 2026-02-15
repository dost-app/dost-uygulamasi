import { useState, useRef, useEffect, useCallback } from 'react';

const CONTROLS_HIDE_DELAY_MS = 4000; // 4 saniye sonra kontroller kaybolur (YouTube gibi)

interface Props {
  storyId: number;
  onComplete: () => void;
  onSkip?: () => void;
}

export default function StrategyIntroVideo({ storyId, onComplete, onSkip }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setControlsVisible(false), CONTROLS_HIDE_DELAY_MS);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [resetHideTimer]);

  const handleActivity = useCallback(() => {
    resetHideTimer();
  }, [resetHideTimer]);

  // Check for skip intro flag
  const hasSkipFlag = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('skipIntro') === '1' || localStorage.getItem('dost_skip_intro') === 'true';
  };

  // If skip flag is set, complete immediately
  useEffect(() => {
    if (hasSkipFlag()) {
      console.log('⏭️ skipIntro flag detected, skipping video...');
      localStorage.setItem('dost_skip_intro', 'true');
      onComplete();
    }
  }, [onComplete]);

  // Check if this is one of the first 3 sessions (mandatory)
  // 4. hikayeden sonra "Tanıtımı Geç" butonuyla kapatılabilir
  // Skip flag overrides mandatory
  const isMandatory = storyId <= 3 && !hasSkipFlag();
  const canSkip = !isMandatory;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let loadTimeout: ReturnType<typeof setTimeout>;
    let hasCompleted = false;

    const completeOnce = () => {
      if (!hasCompleted) {
        hasCompleted = true;
        clearTimeout(loadTimeout);
        onComplete();
      }
    };

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
        setIsLoading(false);
        clearTimeout(loadTimeout);
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      completeOnce();
    };
    const handleLoadedData = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
        setIsLoading(false);
        clearTimeout(loadTimeout);
      }
    };
    const handleError = (e: Event) => {
      console.error('Video error:', e);
      console.log('⚠️ Video yüklenemedi, otomatik olarak geçiliyor...');
      // Video yüklenemezse otomatik olarak geç
      setIsLoading(false);
      completeOnce();
    };
    const handleCanPlay = () => {
      setIsLoading(false);
      clearTimeout(loadTimeout);
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    // Try to load the video
    video.load();

    // Timeout: 10 saniye içinde yüklenemezse otomatik geç
    loadTimeout = setTimeout(() => {
      if (!hasCompleted) {
        console.log('⚠️ Video yükleme zaman aşımı, otomatik olarak geçiliyor...');
        setIsLoading(false);
        completeOnce();
      }
    }, 5000);

    return () => {
      clearTimeout(loadTimeout);
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [onComplete]);

  const handlePlayPause = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
      } else {
        await video.play();
      }
    } catch (error) {
      console.error('Playback error:', error);
      setVideoError('Video oynatılamadı. Lütfen tekrar deneyin.');
    }
  };

  const handleSkip = () => {
    if (canSkip) {
      onSkip?.();
      onComplete();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const showOverlays = controlsVisible || !isPlaying;

  const handleBackdropClick = (e: React.MouseEvent) => {
    handleActivity();
    if (isMandatory && e.target === e.currentTarget) return;
    if (canSkip && e.target === e.currentTarget) handleSkip();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black"
      onMouseMove={handleActivity}
      onTouchStart={handleActivity}
      onClick={handleBackdropClick}
    >
      {/* Video: tam ekran, %100 viewport - header/footer yok */}
      <div className="absolute inset-0 w-full h-full">
        {videoError ? (
          <div className="flex items-center justify-center h-full text-white p-4">
            <div className="text-center">
              <p className="text-red-400 mb-2">{videoError}</p>
              <button
                onClick={() => {
                  setVideoError(null);
                  setIsLoading(true);
                  if (videoRef.current) videoRef.current.load();
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src={`${import.meta.env.BASE_URL}videos/dost-okuma-stratejisi.mp4`}
              controls={false}
              preload="metadata"
              playsInline
            >
              Tarayıcınız video oynatmayı desteklemiyor.
            </video>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <div className="text-white text-center">
                  <p className="mb-2">Video yükleniyor...</p>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Ortadaki play butonu: duraklatıldığında her zaman görünsün */}
      {!isPlaying && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
          <div className="pointer-events-auto">
            <button
              onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-6 shadow-lg transition-all hover:scale-110"
            >
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Üst bar (başlık + geç) - 3–5 sn sonra kaybolur */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between transition-opacity duration-300 ${
          showOverlays ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold text-white mb-1">DOST</h1>
          <h2 className="text-lg font-semibold text-gray-200">
            Strateji Tanıtımı ve Güzel Okuma Kuralları
          </h2>
          {isMandatory && (
            <p className="text-xs text-yellow-400 mt-1">
              ⚠️ Bu oturum için strateji tanıtımı zorunludur. Video bitene kadar kapanmaz.
            </p>
          )}
        </div>
        {canSkip && (
          <button
            onClick={(e) => { e.stopPropagation(); handleSkip(); }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm ml-4"
          >
            Tanıtımı Geç
          </button>
        )}
      </div>

      {/* Alt bar (oynat/duraklat, süre, progress) - 3–5 sn sonra kaybolur */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showOverlays ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-center gap-4 mb-2">
          <button
            onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {isPlaying ? '⏸ Duraklat' : '▶ Oynat'}
          </button>
          <span className="text-white text-lg font-medium">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {isMandatory && (
          <p className="text-xs text-gray-300 text-center mt-2">
            Video bittiğinde otomatik olarak devam edeceksiniz.
          </p>
        )}
      </div>
    </div>
  );
}

