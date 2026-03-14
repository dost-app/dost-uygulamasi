// Voice Generator API client

export interface VoiceGeneratorRequest {
  text: string;
  voice?: string; // Optional voice type
}

export interface VoiceGeneratorResponse {
  audioBase64: string;
  success: boolean;
  error?: string;
}

/**
 * Generate audio from text using DOST voice generator API
 */
export async function generateVoice(
  text: string,
  voice?: string
): Promise<VoiceGeneratorResponse> {
  try {
    // Use the same API endpoint as playTts.ts
    const apiUrl = "https://arge.muhbirai.com/webhook/dost/voice-generator";
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice: voice || 'default',
      }),
    });

    if (!response.ok) {
      throw new Error(`Voice generator API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      audioBase64: data.audioBase64 || data.audio || '',
      success: true,
    };
  } catch (error) {
    console.error('Error generating voice:', error);
    return {
      audioBase64: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Save base64 audio to public/audios/sorular/ via Vite dev server middleware.
 * Falls back to browser download if the dev endpoint is unavailable (production).
 */
export async function saveAudioLocally(
  base64Audio: string,
  fileName: string
): Promise<string | null> {
  const base64Data = base64Audio.includes('data:')
    ? base64Audio.split(',')[1]
    : base64Audio;

  try {
    const res = await fetch('/api/save-audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, base64Audio: base64Data }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.url;
    }
  } catch {
    // Dev server endpoint not available, fall back to download
  }

  // Fallback: trigger browser download so user can place the file manually
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'audio/mpeg' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);

  return `/audios/sorular/${fileName}`;
}

