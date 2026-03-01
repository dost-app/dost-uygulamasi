import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { getApiBase, getApiEnv } from '../../lib/api';
import { getUser } from '../../lib/user';
import VoiceRecorder from '../../components/VoiceRecorder';
import { submitChildrenVoice, type Level1ChildrenVoiceResponse } from '../../lib/level1-api';
import {
  getParagraphs,
  paragraphToPlain,
  getFirstThreeParagraphFirstSentences,
  getFirstSentence,
  type Paragraph,
} from '../../data/stories';
import { useStepContext } from '../../contexts/StepContext';
import { getStoryById, logVoiceInteraction, uploadStudentAudio } from '../../lib/supabase';
import { getStoryImageUrl, getAssetUrl } from '../../lib/image-utils';
import { useAudioPlaybackRate } from '../../hooks/useAudioPlaybackRate';
import { getPlaybackRate, getRecordingDurationSync } from '../../components/SidebarSettings';

export default function Step3() {
  const [story, setStory] = useState<{ id: number; title: string; image: string } | null>(null);
  const { sessionId, storyId, onStepCompleted, setFooterVisible } = useStepContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Apply playback rate to audio element
  useAudioPlaybackRate(audioRef);

  // New states for intro flow (like Step 1 and Step 2)
  const [introPlayed, setIntroPlayed] = useState(false);
  const [started, setStarted] = useState(false);
  const [mascotState, setMascotState] = useState<'idle' | 'speaking' | 'listening'>('idle');

  // Load story data from Supabase
  useEffect(() => {
    const loadStory = async () => {
      try {
        const { data, error } = await getStoryById(storyId);
        if (error || !data) {
          // Fallback to default story - use local image path
          setStory({
            id: storyId,
            title: `Oturum ${storyId}`,
            image: `/images/story${storyId}.png`,
          });
        } else {
          // Use image from Supabase if available, otherwise use local path
          const imagePath = data.image || `/images/story${storyId}.png`;
          setStory({
            id: data.id,
            title: data.title,
            image: imagePath,
          });
        }
      } catch (e) {
        // Fallback to default story - use local image path
        setStory({
          id: storyId,
          title: `Oturum ${storyId}`,
          image: `/images/story${storyId}.png`,
        });
      }
    };
    loadStory();
  }, [storyId]);

  const [phase, setPhase] = useState<'intro' | 'dost' | 'student'>( 'intro' );
  const [analysisText, setAnalysisText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [childrenVoiceResponse, setChildrenVoiceResponse] = useState<string>('');
  const [childrenVoiceTextAudio, setChildrenVoiceTextAudio] = useState<string>(''); // textAudio from API
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [firstSentences, setFirstSentences] = useState<string[]>([]);
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [stepCompleted, setStepCompleted] = useState(false);

  const stepAudio = getAssetUrl('audios/level1/seviye-1-adim-3-fable.mp3');
  const introText = 'Şimdi bu seviyenin üçüncü basamağında metnin ilk cümlelerine bakarak metnin konusunu tahmin edeceğiz. DOST önce ilk üç paragrafın ilk cümlelerini inceleyecek, sonra sıra sana gelecek. Sarı renkle vurgulamış cümleleri dikkatle incele.';

  const paragraphs = useMemo(() => story ? getParagraphs(story.id) : [], [story?.id]);

  useEffect(() => {
    if (story) {
      getFirstThreeParagraphFirstSentences(story.id).then((sentences) => {
        console.log('📝 getFirstThreeParagraphFirstSentences sonucu:', sentences);
        setFirstSentences(sentences);
      });
    }
  }, [story?.id]);

  // helpers to compute first sentence length per paragraph
  const firstSentenceLengths = useMemo(() => {
    return paragraphs.map((p, idx) => {
      const plain = paragraphToPlain(p);
      if (idx < 3) {
        const fs = firstSentences[idx] || '';
        return fs.length;
      }
      // compute generically
      const match = plain.match(/[^.!?\n]+[.!?]?/);
      return match ? match[0].trim().length : 0;
    });
  }, [paragraphs, firstSentences]);

  // Play intro audio when component mounts (before showing Başla button)
  useEffect(() => {
    if (introPlayed) return;
    
    const playIntroAudio = async () => {
      if (!audioRef.current) {
        setIntroPlayed(true);
        return;
      }
      
      try {
        audioRef.current.src = stepAudio;
        audioRef.current.playbackRate = getPlaybackRate();
        setMascotState('speaking');
        
        const handleEnded = () => {
          setMascotState('idle');
          setIntroPlayed(true);
          audioRef.current?.removeEventListener('ended', handleEnded);
        };
        
        audioRef.current.addEventListener('ended', handleEnded);
        await audioRef.current.play();
      } catch (err) {
        console.error('Intro audio play error:', err);
        setIntroPlayed(true);
      }
    };
    
    const timer = setTimeout(playIntroAudio, 300);
    
    return () => {
      clearTimeout(timer);
    };
  }, [stepAudio, introPlayed]);

  // When user clicks "Başla", start the DOST analysis
  useEffect(() => {
    if (!started || analysisText || firstSentences.length === 0) return;
    
    console.log('🎬 DOST analysis başlıyor...');
    setPhase('dost');
    runDostAnalysis();
  }, [started, analysisText, firstSentences]);

  // Stop all audio event listener
  useEffect(() => {
    const stopAll = () => {
      if (audioRef.current) {
        try { audioRef.current.pause(); } catch {}
      }
    };
    window.addEventListener('STOP_ALL_AUDIO' as any, stopAll);
    return () => window.removeEventListener('STOP_ALL_AUDIO' as any, stopAll);
  }, []);

  // Text-to-speech removed - only use mp3 files or API base64 audio

  const playAudioFromBase64 = async (base64: string): Promise<void> => {
    if (!audioRef.current || !base64) throw new Error('no audio');
    
    return new Promise((resolve, reject) => {
      const tryMime = async (mime: string) => {
        const src = base64.trim().startsWith('data:') ? base64.trim() : `data:${mime};base64,${base64.trim()}`;
        audioRef.current!.src = src;
        audioRef.current!.playbackRate = getPlaybackRate();
        setMascotState('speaking');
        
        const handleEnded = () => {
          setMascotState('listening');
          audioRef.current?.removeEventListener('ended', handleEnded);
          resolve();
        };
        
        audioRef.current!.addEventListener('ended', handleEnded);
        await audioRef.current!.play();
      };
      
      tryMime('audio/mpeg').catch(() => {
        tryMime('audio/webm;codecs=opus').catch(() => {
          tryMime('audio/wav').catch((e) => {
            setMascotState('listening');
            reject(e);
          });
        });
      });
    });
  };

  const runDostAnalysis = async () => {
    if (!story) return;
    
    // firstSentences yüklenmemişse bekle
    if (firstSentences.length === 0) {
      console.log('⏳ firstSentences henüz hazır değil, bekleniyor...');
      return;
    }
    
    // Eğer zaten analiz edilmişse tekrar çalıştırma
    if (analysisText) {
      console.log('⏭️ Analysis zaten yapılmış, atlanıyor');
      return;
    }
    
    setIsAnalyzing(true);
    setMascotState('speaking');
    console.log('🔍 DOST analysis API çağrısı yapılıyor...', {
      story: story.title,
      firstSentencesCount: firstSentences.length,
      firstSentences: firstSentences
    });
    
    try {
      const u = getUser();
      // ⚠️ n8n workflow "userId" alanını bekliyor
      // Değer olarak sessionId gönderiliyor (her session için unique)
      // Bu sayede aynı kullanıcının farklı hikayeleri karışmaz
      const { data } = await axios.post(
        `${getApiBase()}/dost/level1/step3`,
        { title: story.title, firstSentences, step: 3, userId: sessionId || `anon-${Date.now()}` },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      console.log('✅ DOST analysis yanıtı alındı:', data);
      
      const text = data.answer || data.message || data.text || data.response || data.textAudio || '';
      setAnalysisText(text);
      setResumeUrl(data.resumeUrl || '');
      
      const audioBase64: string | undefined = data?.audioBase64;
      if (audioBase64 && audioBase64.length > 100) {
        try {
          await playAudioFromBase64(audioBase64);
          setMascotState('listening');
          setPhase('student');
        } catch {
          setMascotState('listening');
          setPhase('student');
        }
      } else {
        setMascotState('listening');
        setPhase('student');
      }
    } catch (e) {
      console.error('❌ DOST analysis hatası:', e);
      const fallback = 'Metnin ilk cümlelerinden yola çıkarak, karıncaların yaşamı, yapısı ve beslenmesi hakkında bilgi verildiğini tahmin ediyorum.';
      setAnalysisText(fallback);
      setMascotState('listening');
      setPhase('student');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderParagraph = (p: Paragraph, idx: number) => {
    // Determine phase-specific highlighting (first 3 for DOST, others for STUDENT)
    const shouldHighlight = (phase === 'dost' && idx < 3) || (phase === 'student' && idx >= 3);

    // İlk 3 paragraf için firstSentences kullan, diğerleri için dinamik hesapla
    let targetText: string | null = null;
    if (idx < 3) {
      targetText = firstSentences[idx] || null;
    } else if (phase === 'student') {
      // idx >= 3 için paragrafın ilk cümlesini hesapla
      const plainText = paragraphToPlain(p);
      targetText = getFirstSentence(plainText);
    }
    
    if (idx < 5) {
      console.log(`🎨 Paragraf ${idx} highlight:`, {
        phase,
        shouldHighlight,
        targetText,
        paragraphText: paragraphToPlain(p).substring(0, 100)
      });
    }
    
    // Paragrafın düz metnini al
    const fullText = paragraphToPlain(p);
    
    // targetText yoksa veya highlight yapılmayacaksa, normal render
    if (!shouldHighlight || !targetText) {
      const parts: React.ReactElement[] = [];
      p.forEach((seg, i) => {
        const base = seg.bold ? 'font-bold' : undefined;
        parts.push(<span key={i} className={base}>{seg.text}</span>);
      });
      return <p key={idx} className="mt-3 leading-relaxed text-gray-800">{parts}</p>;
    }
    
    // targetText'in paragraftaki konumunu bul
    const targetStart = fullText.indexOf(targetText);
    const targetEnd = targetStart + targetText.length;
    
    if (targetStart < 0) {
      // targetText bulunamadı, normal render
      const parts: React.ReactElement[] = [];
      p.forEach((seg, i) => {
        const base = seg.bold ? 'font-bold' : undefined;
        parts.push(<span key={i} className={base}>{seg.text}</span>);
      });
      return <p key={idx} className="mt-3 leading-relaxed text-gray-800">{parts}</p>;
    }
    
    // Her segment için karakter pozisyonunu takip ederek highlight yap
    const parts: React.ReactElement[] = [];
    let charPos = 0;
    let keyCounter = 0;
    
    p.forEach((seg) => {
      const segStart = charPos;
      const segEnd = charPos + seg.text.length;
      const base = seg.bold ? 'font-bold' : '';
      
      // Bu segment targetText ile kesişiyor mu?
      if (segEnd <= targetStart || segStart >= targetEnd) {
        // Kesişmiyor - normal render
        parts.push(<span key={keyCounter++} className={base || undefined}>{seg.text}</span>);
      } else {
        // Kesişiyor - bölümlere ayır
        
        // Segment başı targetText'ten önce mi?
        if (segStart < targetStart) {
          const beforeText = seg.text.substring(0, targetStart - segStart);
          parts.push(<span key={keyCounter++} className={base || undefined}>{beforeText}</span>);
        }
        
        // Highlight edilecek kısım
        const highlightStart = Math.max(0, targetStart - segStart);
        const highlightEnd = Math.min(seg.text.length, targetEnd - segStart);
        const highlightText = seg.text.substring(highlightStart, highlightEnd);
        parts.push(
          <span key={keyCounter++} className={`rounded px-1 bg-yellow-300 ${base}`}>{highlightText}</span>
        );
        
        // Segment sonu targetText'ten sonra mı?
        if (segEnd > targetEnd) {
          const afterText = seg.text.substring(targetEnd - segStart);
          parts.push(<span key={keyCounter++} className={base || undefined}>{afterText}</span>);
        }
      }
      
      charPos = segEnd;
    });
    
    return <p key={idx} className="mt-3 leading-relaxed text-gray-800">{parts}</p>;
  };

  const handleVoiceSubmit = async (audioBlob: Blob) => {
    if (!story) return;
    setIsProcessingVoice(true);
    setMascotState('speaking');
    console.log('🎤 Çocuk sesi gönderiliyor (submitChildrenVoice API)...');
    
    // Calculate student phase target sentences (paragraphs 3+)
    const studentSentences = paragraphs.slice(3).map(p => 
      getFirstSentence(paragraphToPlain(p))
    ).filter(Boolean);
    
    console.log('📝 Student phase hedef cümleler:', studentSentences);
    
    try {
      // Use sessionId for consistency with DOST API
      const response: Level1ChildrenVoiceResponse = await submitChildrenVoice(
        audioBlob,
        resumeUrl,
        story.title,
        3,
        'cumle_tahmini',
        sessionId || `anon-${Date.now()}`, // sessionId (same as userId in DOST API)
        studentSentences // Target sentences for n8n comparison
      );

      console.log('✅ Çocuk sesi yanıtı alındı:', response);
      
      // Get textAudio from response
      const textAudio = response.textAudio || '';
      const responseText = response.respodKidVoice || response.message || response.text || response.response || textAudio || 'Teşekkürler! Tahminlerini dinledim.';
      
      setChildrenVoiceResponse(responseText);
      setChildrenVoiceTextAudio(textAudio);

      // Öğrencinin sesini ve API yanıtını kaydet
      const user = getUser();
      if (user?.studentId) {
        const audioUrl = await uploadStudentAudio(audioBlob, user.studentId, storyId, 1, 3).catch(() => null);
        logVoiceInteraction(sessionId, user.studentId, storyId, 1, 3, {
          endpoint: '/dost/level1/step3 (cumle_tahmini)',
          apiResponseText: responseText,
          audioStorageUrl: audioUrl,
        }).catch(console.error);
      }
      
      // Play response audio if available
      if (response.audioBase64 && response.audioBase64.length > 100) {
        try {
          await playAudioFromBase64(response.audioBase64);
          // Audio finished, step is complete
          setStepCompleted(true);
          setMascotState('idle');
        } catch {
          // Audio playback failed, still mark as complete
          setStepCompleted(true);
          setMascotState('idle');
        }
      } else {
        // No audio, mark as complete
        setStepCompleted(true);
        setMascotState('idle');
      }
    } catch (e) {
      console.error('❌ Çocuk sesi gönderim hatası:', e);
      const fallback = 'Çok iyi! Tahminlerin mantıklı görünüyor.';
      setChildrenVoiceResponse(fallback);
      setStepCompleted(true);
      setMascotState('idle');
    } finally {
      setIsProcessingVoice(false);
    }
  };

  // Call onStepCompleted when step is completed
  useEffect(() => {
    if (stepCompleted && onStepCompleted) {
      onStepCompleted({
        analysisText,
        childrenVoiceResponse,
        childrenVoiceTextAudio,
        resumeUrl
      });
    }
  }, [stepCompleted, onStepCompleted, analysisText, childrenVoiceResponse, childrenVoiceTextAudio, resumeUrl]);

  if (!story) {
    return <div className="w-full max-w-5xl mx-auto px-4">Yükleniyor...</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <audio ref={audioRef} preload="auto" />

      {!started ? (
        // Intro screen with Başla button (like Step 1 and Step 2)
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg border border-purple-200 p-6 max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-purple-800 mb-2">
              3. Adım: Metindeki cümleleri inceleme ve tahminde bulunma
            </h2>
            <p className="text-gray-700">
              {introText}
            </p>
            
            {/* Show speaking indicator while intro audio is playing */}
            {!introPlayed && mascotState === 'speaking' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-purple-600">
                <div className="animate-pulse">🔊</div>
                <span className="font-medium">DOST açıklıyor...</span>
              </div>
            )}
          </div>
          
          {/* Show Başla button only after intro audio finishes */}
          {introPlayed && (
            <button
              onClick={() => { setStarted(true); setFooterVisible(true); }}
              className="mt-6 bg-purple-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-purple-700 transition text-xl font-bold"
            >
              Başla
            </button>
          )}
        </div>
      ) : (
        // Main step content
        <>
          <h2 className="text-2xl font-bold text-purple-800 mb-4">3. Adım: Metindeki cümleleri inceleme ve tahminde bulunma</h2>

          <div className="mb-4">
            <img src={getStoryImageUrl(story.image)} alt={story.title} className="w-full max-w-xs mx-auto rounded-xl shadow" />
            <p className="mt-2 text-center text-lg font-semibold text-purple-800">{story.title}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            {/* DOST is analyzing */}
            {isAnalyzing && phase === 'dost' && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="text-blue-700 font-medium">DOST metnin ilk üç paragrafının ilk cümlelerini inceliyor ve tahmin yapıyor...</p>
                </div>
              </div>
            )}

            {/* DOST speaking indicator */}
            {mascotState === 'speaking' && analysisText && !isAnalyzing && (
              <div className="mb-4 flex items-center gap-2 text-purple-600">
                <div className="animate-pulse">🔊</div>
                <span className="font-medium">DOST açıklıyor...</span>
              </div>
            )}

            {/* Show DOST's analysis */}
            {analysisText && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-bold text-blue-800 mb-2">🤖 DOST'un Tahmini:</h3>
                <p className="text-blue-700">{analysisText}</p>
              </div>
            )}

            <div className="text-lg">
              {paragraphs.map((p, idx) => renderParagraph(p, idx))}
            </div>

            {/* Cevap değerlendiriliyor uyarı ekranı */}
            {isProcessingVoice && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4 text-center">
                  <div className="animate-spin rounded-full h-14 w-14 border-4 border-purple-500 border-t-transparent mx-auto mb-4" />
                  <p className="text-xl font-semibold text-gray-800">Cevabın değerlendiriliyor</p>
                  <p className="text-gray-600 mt-2">Lütfen bekle, DOST seni dinliyor.</p>
                </div>
              </div>
            )}

            {/* Student's turn - only show when mascot is listening */}
            {phase === 'student' && !childrenVoiceResponse && mascotState === 'listening' && (
              <div className="mt-6 text-center">
                <div className="bg-yellow-50 rounded-lg border-l-4 border-yellow-400 p-4 mb-4">
                  <p className="text-yellow-800 font-medium">Görev:</p>
                  <p className="text-yellow-700">Diğer paragrafların ilk cümlelerine bakarak metnin devamı hakkında tahmin yap!</p>
                </div>
                <p className="mb-4 text-xl font-bold text-green-700 animate-pulse">Hadi sıra sende! Mikrofona konuş</p>
                <VoiceRecorder 
                  recordingDurationMs={getRecordingDurationSync()}
                  autoSubmit={true}
                  onSave={handleVoiceSubmit} 
                  onPlayStart={() => { try { window.dispatchEvent(new Event('STOP_ALL_AUDIO' as any)); } catch {} }} 
                  storyId={storyId}
                  level={1}
                  step={3}
                  disabled={isProcessingVoice}
                />
                {isProcessingVoice && (
                  <p className="mt-2 text-blue-600 font-medium">DOST senin sözlerini değerlendiriyor...</p>
                )}
              </div>
            )}

            {/* Show response from API */}
            {childrenVoiceResponse && (
              <div className="mt-6 p-4 bg-green-50 rounded border border-green-200">
                <h3 className="font-bold text-green-800 mb-2">🗣️ DOST'un Yorumu:</h3>
                <p className="text-green-700 text-lg">{childrenVoiceResponse}</p>
                {childrenVoiceTextAudio && childrenVoiceTextAudio !== childrenVoiceResponse && (
                  <p className="text-green-600 mt-2 italic">{childrenVoiceTextAudio}</p>
                )}
                
                {/* Speaking indicator while response audio plays */}
                {mascotState === 'speaking' && (
                  <div className="mt-3 flex items-center gap-2 text-purple-600">
                    <div className="animate-pulse">🔊</div>
                    <span className="font-medium">DOST konuşuyor...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
