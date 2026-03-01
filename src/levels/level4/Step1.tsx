import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSchema } from '../../data/schemas';
import { useStepContext } from '../../contexts/StepContext';
import { getPlaybackRate } from '../../components/SidebarSettings';
import { useAudioPlaybackRate } from '../../hooks/useAudioPlaybackRate';
import { getAppMode } from '../../lib/api';
import { submitSchemaSectionReading, getResumeResponse } from '../../lib/level4-api';
import { logVoiceInteraction, uploadStudentAudio } from '../../lib/supabase';
import type { RootState } from '../../store/store';
import VoiceRecorder from '../../components/VoiceRecorder';
import { getRecordingDurationSync } from '../../components/SidebarSettings';
import { TestTube, Mic } from 'lucide-react';
import { getAssetUrl } from '../../lib/image-utils';

export default function L4Step1() {
  const student = useSelector((state: RootState) => state.user.student);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [started, setStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [introAudioPlaying, setIntroAudioPlaying] = useState(true);
  const [isPlayingSectionAudio, setIsPlayingSectionAudio] = useState(false);
  const [isPlayingSiraSende, setIsPlayingSiraSende] = useState(false);
  const [isWaitingForRecording, setIsWaitingForRecording] = useState(false);
  const [isProcessingResponse, setIsProcessingResponse] = useState(false);
  const [isPlayingResponse, setIsPlayingResponse] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [testAudioActive, setTestAudioActive] = useState(false);
  const [apiResponseText, setApiResponseText] = useState<string>('');
  const { sessionId, onStepCompleted, storyId, setFooterVisible } = useStepContext();
  
  // Apply playback rate to audio element
  useAudioPlaybackRate(audioRef);

  const schema = useMemo(() => getSchema(storyId), [storyId]);
  const appMode = getAppMode();

  // Test audio aktif mi kontrol et
  useEffect(() => {
    const checkTestAudio = () => {
      const globalEnabled = localStorage.getItem('use_test_audio_global') === 'true';
      setTestAudioActive(globalEnabled);
    };

    checkTestAudio();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'use_test_audio_global') {
        checkTestAudio();
      }
    };

    const handleCustomEvent = () => {
      checkTestAudio();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('testAudioChanged', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('testAudioChanged', handleCustomEvent);
    };
  }, []);

  const instruction = 'Şimdi dördüncü seviyeye geçiyoruz. Sırada bu metni özetleme var. Metinde geçen önemli bilgi birimlerini söyleyerek metni önce ben özetleyeceğim sonra da aynı şekilde sen özetleyeceksin. Özetleme yaparken önemli bilgi birimlerine ve metnin içeriğinin akış sırasına çok dikkat etmen gerekiyor. Bunu kolayca yapabilmen için senin için oluşturduğum şemayı ekrandan takip etmen gerekiyor. Şimdi ben özetlemeye başlıyorum. Lütfen sen de ilgili yerlere bakarak takip etmeye başla.';

  useEffect(() => {
    // Play intro audio on component mount
    const playIntroAudio = () => {
      const el = audioRef.current;
      if (!el) {
        setTimeout(playIntroAudio, 100);
        return;
      }

      console.log('🎵 Setting up intro audio:', getAssetUrl('audios/level4/seviye-4-adim-1.mp3'));
      el.src = getAssetUrl('audios/level4/seviye-4-adim-1.mp3');
      (el as any).playsInline = true;
      el.muted = false;
      el.playbackRate = getPlaybackRate();
      
      const handleCanPlay = () => {
        console.log('✅ Audio can play, readyState:', el.readyState);
        el.play().then(() => {
          console.log('✅ Intro audio started playing');
          setIntroAudioPlaying(true);
        }).catch((err) => {
          console.error('❌ Error playing intro audio:', err);
          setIntroAudioPlaying(false);
        });
      };

      const handleEnded = () => {
        console.log('✅ Intro audio finished');
        setIntroAudioPlaying(false);
      };

      const handleError = (e: Event) => {
        console.error('❌ Intro audio error:', e, el.error);
        setIntroAudioPlaying(false);
      };

      el.addEventListener('canplay', handleCanPlay, { once: true });
      el.addEventListener('ended', handleEnded, { once: true });
      el.addEventListener('error', handleError, { once: true });

      if (el.readyState >= 2) {
        handleCanPlay();
      } else {
        el.load();
      }
    };

    const timeoutId = setTimeout(playIntroAudio, 200);

    const stopAll = () => {
      try {
        audioRef.current?.pause();
      } catch {}
    };
    window.addEventListener('STOP_ALL_AUDIO' as any, stopAll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('STOP_ALL_AUDIO' as any, stopAll);
      try { 
        window.speechSynthesis.cancel(); 
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      } catch {} 
    };
  }, []);

  // Bölüm geçiş sesi: "Şimdi diğer bölüme geçiyorum. Dikkatle takip et."
  const playTransitionAudio = (): Promise<void> => {
    return new Promise((resolve) => {
      const el = audioRef.current;
      if (!el) {
        resolve();
        return;
      }
      el.src = getAssetUrl('audios/level4/gecis-diger-bolume.mp3');
      el.playbackRate = getPlaybackRate();
      (el as any).playsInline = true;
      el.muted = false;
      el.onended = () => resolve();
      el.onerror = () => resolve();
      el.play().catch(() => resolve());
    });
  };

  // Play section audio when currentSection changes (önce geçiş sesi, sonra bölüm sesi)
  useEffect(() => {
    if (!started || !schema || currentSection >= schema.sections.length) return;

    const playSectionAudio = async () => {
      const el = audioRef.current;
      if (!el) return;

      const section = schema.sections[currentSection];
      const audioPaths = [
        getAssetUrl(`audios/level4/adim1/schema-${storyId}-${section.id}.mp3`)
      ];

      const playSectionFile = () => {
        console.log(`🎵 Playing section ${currentSection + 1} audio`);
        setIsPlayingSectionAudio(true);

        const tryPlayAudio = (pathIndex: number) => {
          if (pathIndex >= audioPaths.length) {
            setIsPlayingSectionAudio(false);
            playSiraSendeAudio();
            return;
          }
          el.src = audioPaths[pathIndex];
          el.playbackRate = getPlaybackRate();
          (el as any).playsInline = true;
          el.muted = false;

          const handleEnded = () => {
            setIsPlayingSectionAudio(false);
            playSiraSendeAudio();
          };
          const handleError = () => {
            el.removeEventListener('ended', handleEnded);
            el.removeEventListener('error', handleError);
            tryPlayAudio(pathIndex + 1);
          };

          el.addEventListener('ended', handleEnded, { once: true });
          el.addEventListener('error', handleError, { once: true });
          el.play().catch(() => {
            el.removeEventListener('ended', handleEnded);
            el.removeEventListener('error', handleError);
            tryPlayAudio(pathIndex + 1);
          });
        };
        tryPlayAudio(0);
      };

      if (currentSection > 0) {
        await playTransitionAudio();
      }
      playSectionFile();
    };

    playSectionAudio();
  }, [started, currentSection, schema, storyId]);

  const playSiraSendeAudio = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const el = audioRef.current;
      if (!el) {
        setIsWaitingForRecording(true);
        resolve();
        return;
      }

      try {
        setIsPlayingSiraSende(true);
        el.src = getAssetUrl('audios/sira-sende-mikrofon.mp3');
        (el as any).playsInline = true;
        el.muted = false;
        el.playbackRate = getPlaybackRate();
        
        el.onended = () => {
          setIsPlayingSiraSende(false);
          setIsWaitingForRecording(true);
          resolve();
        };
        
        el.onerror = () => {
          console.warn('Sıra sende audio not found, continuing...');
          setIsPlayingSiraSende(false);
          setIsWaitingForRecording(true);
          resolve(); // Continue even if audio doesn't exist
        };
        
        el.play().catch((err) => {
          console.warn('Error playing sira sende audio:', err);
          setIsPlayingSiraSende(false);
          setIsWaitingForRecording(true);
          resolve(); // Continue even if play fails
        });
      } catch (err) {
        console.warn('Error setting up sira sende audio:', err);
        setIsPlayingSiraSende(false);
        setIsWaitingForRecording(true);
        resolve(); // Continue even if setup fails
      }
    });
  };

  const handleVoiceSubmit = async (audioBlob: Blob) => {
    if (!student || !schema) return;
    
    setIsWaitingForRecording(false);
    setIsProcessingResponse(true);

    try {
      const section = schema.sections[currentSection];
      const sectionTitle = section.title;
      const sectionItems = section.items.join('\n');
      const paragrafText = `${sectionTitle}\n${sectionItems}`; // n8n bu field'ı bekliyor
      
      // Convert audio blob to base64
      const reader = new FileReader();
      const audioBase64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          const base64String = base64.split(',')[1] || base64;
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      const isLastSection = currentSection === schema.sections.length - 1;
      
      console.log(`📤 Submitting section ${currentSection + 1}/${schema.sections.length}`, {
        paragrafNo: currentSection + 1,
        isLastSection,
        audioSize: audioBlob.size,
      });

      let response;
      if (resumeUrl) {
        // Resume from n8n webhook wait
        // ⚠️ n8n workflow "studentId" alanını bekliyor
        // Değer olarak sessionId gönderiliyor (her session için unique)
        // Bu sayede aynı kullanıcının farklı hikayeleri karışmaz
        response = await getResumeResponse(resumeUrl, {
          studentId: sessionId || `anon-${Date.now()}`,
          sectionTitle,
          paragrafText, // n8n bu field'ı bekliyor
          audioBase64,
          isLatestParagraf: isLastSection, // n8n bu field'ı bekliyor
          paragrafNo: currentSection + 1, // n8n bu field'ı bekliyor
        });
      } else {
        // First section - initial webhook call
        // ⚠️ n8n workflow "studentId" alanını bekliyor
        // Değer olarak sessionId gönderiliyor (her session için unique)
        // Bu sayede aynı kullanıcının farklı hikayeleri karışmaz
        response = await submitSchemaSectionReading({
          studentId: sessionId || `anon-${Date.now()}`,
          sectionTitle,
          paragrafText, // n8n bu field'ı bekliyor
          audioBase64,
          isLatestParagraf: isLastSection, // n8n bu field'ı bekliyor
          paragrafNo: currentSection + 1, // n8n bu field'ı bekliyor
        });
      }

      console.log(`✅ Received response for section ${currentSection + 1}:`, {
        hasAudio: !!response.audioBase64,
        hasResumeUrl: !!response.resumeUrl,
      });

      // Store resume URL for next section
      if (response.resumeUrl) {
        setResumeUrl(response.resumeUrl);
      }

      // Show textAudio if available
      if (response.textAudio) {
        setApiResponseText(response.textAudio);
      }

      // Öğrencinin şema okuma denemesini ve sesini kaydet
      if (student) {
        const audioUrl = await uploadStudentAudio(audioBase64, student.id, storyId, 4, 1).catch(() => null);
        logVoiceInteraction(sessionId, student.id, storyId, 4, 1, {
          endpoint: '/dost/level4/step1',
          apiResponseText: response.textAudio ?? null,
          apiResponseSummary: { section: currentSection + 1 },
          audioStorageUrl: audioUrl,
        }).catch(console.error);
      }

      // Play n8n response audio
      if (response.audioBase64) {
        await playResponseAudio(response.audioBase64);
      }

      // Mark section as completed
      setCompletedSections(prev => new Set([...prev, currentSection]));

      // Move to next section or complete
      if (isLastSection) {
        console.log('✅ All sections completed!');
        if (onStepCompleted) {
          onStepCompleted({
            totalSections: schema.sections.length,
            completed: true,
          });
        }
      } else {
        // Auto-advance to next section
        setTimeout(() => {
          setApiResponseText(''); // Clear previous response text
          setCurrentSection(currentSection + 1);
        }, 1000);
      }

    } catch (err) {
      console.error('Failed to process voice recording:', err);
      alert('Ses kaydı işlenemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsProcessingResponse(false);
    }
  };

  const playResponseAudio = async (audioBase64: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const el = audioRef.current;
      if (!el) {
        reject(new Error('Audio element not found'));
        return;
      }

      try {
        const audioData = `data:audio/mp3;base64,${audioBase64}`;
        el.src = audioData;
        (el as any).playsInline = true;
        el.muted = false;
        el.playbackRate = getPlaybackRate();
        
        setIsPlayingResponse(true);
        
        el.onended = () => {
          setIsPlayingResponse(false);
          resolve();
        };
        
        el.onerror = () => {
          setIsPlayingResponse(false);
          reject(new Error('Error playing response audio'));
        };
        
        el.play().catch((err) => {
          setIsPlayingResponse(false);
          reject(err);
        });
      } catch (err) {
        setIsPlayingResponse(false);
        reject(err);
      }
    });
  };

  const startFlow = async () => {
    setFooterVisible(true);
    // Stop intro audio if still playing
    const el = audioRef.current;
    if (el && introAudioPlaying) {
      el.pause();
      el.currentTime = 0;
      setIntroAudioPlaying(false);
    }

    setStarted(true);
    setCurrentSection(0);
    setCompletedSections(new Set());
  };


  if (!schema) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Şema bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <audio ref={audioRef} preload="auto" />
      <div className="flex flex-col items-center justify-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-purple-800">1. Adım: Dolu Şemaya Bakarak Metnin Özetini Dinleme</h2>
        {!started && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mb-4">
              <p className="text-gray-700 text-left leading-relaxed">
                {instruction}
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              {testAudioActive && (
                <div className="px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg text-sm text-yellow-800 flex items-center gap-2">
                  <TestTube className="w-4 h-4" />
                  <span>🧪 Test modu: Hazır ses kullanılacak</span>
                </div>
              )}
              
              {appMode === 'prod' && introAudioPlaying ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
                  <p className="text-gray-600">Ses çalınıyor...</p>
                </div>
              ) : (
                <button 
                  onClick={startFlow} 
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold"
                >
                  Başla
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {started && (
        <div className="bg-white rounded-xl shadow p-8">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-center mb-8 text-gray-800">{schema.title}</h3>
            
            {/* Progress indicator */}
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
                <span className="text-sm font-semibold text-purple-800">
                  Şematik {currentSection + 1} / {schema.sections.length}
                </span>
                {isPlayingSectionAudio && (
                  <div className="flex items-center gap-2 text-purple-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
                    <span className="text-xs">DOST okuyor...</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {schema.sections.map((section, idx) => {
                const isCurrent = idx === currentSection;
                const isCompleted = completedSections.has(idx);
                const isFuture = idx > currentSection;
                
                return (
                  <div
                    key={section.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isCurrent && isPlayingSectionAudio
                        ? 'border-purple-500 bg-purple-50 scale-[1.02] shadow-lg ring-4 ring-purple-300 ring-opacity-80 animate-pulse'
                        : isCurrent
                        ? 'border-purple-500 bg-purple-50 scale-[1.02] ring-2 ring-purple-300'
                        : isCompleted
                        ? 'border-green-500 bg-green-50'
                        : isFuture
                        ? 'border-gray-300 bg-gray-50 opacity-60'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-purple-800">{section.title}</h4>
                      {isCompleted && (
                        <span className="text-green-600 text-xl">✓</span>
                      )}
                      {isCurrent && isPlayingSectionAudio && (
                        <span className="text-purple-600 animate-pulse" aria-hidden>🔊</span>
                      )}
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-bold text-purple-600">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Microphone/Response Card - Always visible when started */}
            {(isPlayingSectionAudio || isPlayingSiraSende || isWaitingForRecording || isProcessingResponse || isPlayingResponse || apiResponseText) && (
              <div className="sticky bottom-0 bg-white border-t-2 rounded-lg shadow-lg p-4 mt-3 z-50" 
                   style={{
                     borderColor: isPlayingSectionAudio ? '#9CA3AF' : isPlayingSiraSende ? '#10B981' : isProcessingResponse || isPlayingResponse ? '#F59E0B' : apiResponseText ? '#3B82F6' : '#10B981'
                   }}>
                {isPlayingSectionAudio && !apiResponseText && (
                  <>
                    <p className="text-center mb-2 text-base font-bold text-gray-500">
                      🔊 DOST şematiği okuyor...
                    </p>
                    {/* VoiceRecorder placeholder - gerçek recorder sadece isWaitingForRecording'de */}
                    <div className="flex justify-center opacity-50 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <Mic className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                  </>
                )}
                
                {isPlayingSiraSende && !apiResponseText && (
                  <>
                    <p className="text-center mb-2 text-base font-bold text-green-700">
                      🎤 Şimdi sıra sende! Mikrofona konuş
                    </p>
                    {/* VoiceRecorder placeholder - gerçek recorder sadece isWaitingForRecording'de */}
                    <div className="flex justify-center opacity-50 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center animate-pulse">
                        <Mic className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </>
                )}
                
                {isWaitingForRecording && !isProcessingResponse && !isPlayingResponse && !apiResponseText && !isPlayingSiraSende && (
                  <>
                    <p className="text-center mb-2 text-base font-bold text-green-700">
                      🎤 Şimdi sıra sende! Mikrofona konuş
                    </p>
                    <div className="flex justify-center">
                      <VoiceRecorder
                        recordingDurationMs={getRecordingDurationSync()}
                        autoSubmit={true}
                        onSave={handleVoiceSubmit}
                        onPlayStart={() => {
                          try {
                            window.dispatchEvent(new Event('STOP_ALL_AUDIO' as any));
                          } catch {}
                        }}
                        compact={true}
                        storyId={storyId}
                        level={4}
                        step={1}
                        disabled={isProcessingResponse}
                      />
                    </div>
                  </>
                )}
                
                {(isProcessingResponse || isPlayingResponse) && !apiResponseText && (
                  <div className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-500 border-t-transparent"></div>
                      <p className="text-orange-600 font-semibold text-base">
                        ⏳ DOST'tan cevap bekleniyor...
                      </p>
                    </div>
                  </div>
                )}

                {apiResponseText && (
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2 text-center">🤖 DOST'un Yanıtı:</h4>
                    <p className="text-blue-700 text-center">{apiResponseText}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
