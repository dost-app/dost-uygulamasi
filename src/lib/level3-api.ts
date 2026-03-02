import apiClient from './apiClient';
import type { ApiLogContext } from './apiClient';
import { getApiBase } from './api';
import { getVoiceResponseTimeoutSync, getParagraphResponseTimeoutSync } from '../components/SidebarSettings';
import type {
  Level3Step1Request,
  Level3Step1ParagraphRequest,
  Level3Step1ParagraphResponse,
  Level3Step1Response,
  Level3Step2Request,
  Level3Step2Response,
} from '../types';

export interface Level3ApiOptions {
  logContext?: ApiLogContext;
}

// Helper: Convert payload to FormData to avoid CORS preflight
function toFormData(payload: Record<string, any>): FormData {
  const fd = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue;

    // Convert boolean/number to string for FormData
    if (typeof value === 'boolean' || typeof value === 'number') {
      fd.append(key, String(value));
    } else if (typeof value === 'object' && !(value instanceof Blob) && !(value instanceof File)) {
      // Serialize objects as JSON string
      fd.append(key, JSON.stringify(value));
    } else {
      fd.append(key, value as any);
    }
  }

  return fd;
}

/**
 * Level 3 Step 1 - Paragraf okuma API'si
 * ⚠️ NOT: n8n workflow "studentId" alanını bekliyor
 * Değer olarak sessionId gönderiliyor (her session için unique)
 * Bu sayede aynı kullanıcının farklı hikayeleri karışmaz
 */
export async function submitParagraphReading(
  request: Level3Step1Request,
  options?: Level3ApiOptions
): Promise<Level3Step1Response> {
  const response = await apiClient.post<Level3Step1Response>(
    `${getApiBase()}/dost/level3/step1`,
    request,
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: getParagraphResponseTimeoutSync(),
      meta: { logContext: options?.logContext },
    } as any
  );
  return response.data;
}

/**
 * Level 3 Step 1 - Resume response (sonraki paragraflar için)
 * ⚠️ NOT: n8n workflow "studentId" alanını bekliyor
 * Değer olarak sessionId gönderiliyor (her session için unique)
 * Bu sayede aynı kullanıcının farklı hikayeleri karışmaz
 */
export async function getResumeResponse(
  resumeUrl: string,
  request: Level3Step1Request,
  options?: Level3ApiOptions
): Promise<Level3Step1Response> {
  let finalUrl = resumeUrl;
  if (finalUrl.startsWith('http://')) {
    finalUrl = finalUrl.replace('http://', 'https://');
  }
  const payload = {
    studentId: request.studentId,
    paragrafText: request.paragrafText,
    audioBase64: request.audioBase64,
    isLatestParagraf: request.isLatestParagraf,
    paragrafNo: request.paragrafNo,
  };
  const formData = toFormData(payload);
  const response = await apiClient.post<Level3Step1Response>(finalUrl, formData, {
    withCredentials: false,
    timeout: getParagraphResponseTimeoutSync(),
    meta: { logContext: options?.logContext },
  } as any);
  return response.data;
}

/**
 * Level 3 Step 2 - Okuma hızı analizi API'si
 * ⚠️ NOT: n8n workflow "userId" alanını bekliyor
 * Değer olarak sessionId gönderiliyor (her session için unique)
 * Bu sayede aynı kullanıcının farklı hikayeleri karışmaz
 */
export async function submitReadingSpeedAnalysis(
  request: Level3Step2Request,
  options?: Level3ApiOptions
): Promise<Level3Step2Response> {
  const formData = new FormData();
  formData.append('audioFile', request.audioFile, request.fileName || 'recording.webm');
  formData.append('userId', request.userId);
  formData.append('durationMs', String(request.durationMs));
  formData.append('hedefOkuma', String(request.hedefOkuma));
  formData.append('metin', request.metin);
  if (request.startTime) formData.append('startTime', request.startTime);
  if (request.endTime) formData.append('endTime', request.endTime);
  if (request.mimeType) formData.append('mimeType', request.mimeType);

  const response = await apiClient.post<Level3Step2Response>(
    `${getApiBase()}/dost/level3/step2`,
    formData,
    {
      withCredentials: false,
      timeout: getVoiceResponseTimeoutSync() * 1.5,
      meta: { logContext: options?.logContext },
    } as any
  );
  return response.data;
}

export async function submitLevel3ReadingAnalysis(
  request: {
    sessionId: string;
    audioBase64: string;
    text: string;
    recordingStartTime: string;
    recordingEndTime: string;
    selectedWordCount: number;
    userId?: string;
  },
  options?: Level3ApiOptions
): Promise<any> {
  const response = await apiClient.post(
    `${getApiBase()}/dost/level3/step2`,
    { ...request, sessionId: request.sessionId },
    {
      headers: { 'Content-Type': 'application/json' },
      meta: { logContext: options?.logContext },
    } as any
  );
  return response.data;
}

export interface VoiceGeneratorRequest {
  text: string;
}

export interface VoiceGeneratorResponse {
  audioBase64: string;
}

export async function generateVoice(
  request: VoiceGeneratorRequest,
  options?: Level3ApiOptions
): Promise<VoiceGeneratorResponse> {
  const response = await apiClient.post<VoiceGeneratorResponse>(
    `${getApiBase()}/dost/voice-generator`,
    request,
    {
      headers: { 'Content-Type': 'application/json' },
      meta: { logContext: options?.logContext },
    } as any
  );
  return response.data;
}


