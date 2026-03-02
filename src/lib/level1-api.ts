import apiClient from './apiClient';
import type { ApiLogContext } from './apiClient';
import { getApiBase } from './api';
import type {
  Level1ImageAnalysisRequest,
  Level1ImageAnalysisResponse,
  Level1ChildrenVoiceResponse,
  Level1TitleAnalysisRequest,
  Level1TitleAnalysisResponse,
  Level1SentencesAnalysisRequest,
  Level1SentencesAnalysisResponse,
  Level1ObjectiveAnalysisRequest,
  Level1ObjectiveAnalysisResponse,
} from '../types';

// Re-export for convenience
export type { Level1ChildrenVoiceResponse } from '../types';
export type { ApiLogContext } from './apiClient';

export interface Level1ApiOptions {
  logContext?: ApiLogContext;
}

/**
 * Analyzes the story image and returns explanation, audio, and resumeUrl
 */
export async function analyzeStoryImage(
  request: Level1ImageAnalysisRequest,
  options?: Level1ApiOptions
): Promise<Level1ImageAnalysisResponse> {
  const { data } = await apiClient.post<Level1ImageAnalysisResponse>(
    `${getApiBase()}/dost/level1`,
    request,
    { headers: { 'Content-Type': 'application/json' }, meta: { logContext: options?.logContext } } as any
  );
  return data;
}

/**
 * Analyzes story title for Step 2
 */
export async function analyzeTitleForStep2(
  request: Level1TitleAnalysisRequest,
  options?: Level1ApiOptions
): Promise<Level1TitleAnalysisResponse> {
  const { data } = await apiClient.post<Level1TitleAnalysisResponse>(
    `${getApiBase()}/dost/level1/step2`,
    request,
    { headers: { 'Content-Type': 'application/json' }, meta: { logContext: options?.logContext } } as any
  );
  return data;
}

/**
 * Analyzes story sentences for Step 3
 */
export async function analyzeSentencesForStep3(
  request: Level1SentencesAnalysisRequest,
  options?: Level1ApiOptions
): Promise<Level1SentencesAnalysisResponse> {
  const { data } = await apiClient.post<Level1SentencesAnalysisResponse>(
    `${getApiBase()}/dost/level1/step3`,
    request,
    { headers: { 'Content-Type': 'application/json' }, meta: { logContext: options?.logContext } } as any
  );
  return data;
}

/**
 * Analyzes reading objective for Step 4
 */
export async function analyzeObjectiveForStep4(
  request: Level1ObjectiveAnalysisRequest,
  options?: Level1ApiOptions
): Promise<Level1ObjectiveAnalysisResponse> {
  const { data } = await apiClient.post<Level1ObjectiveAnalysisResponse>(
    `${getApiBase()}/dost/level1/step4`,
    request,
    { headers: { 'Content-Type': 'application/json' }, meta: { logContext: options?.logContext } } as any
  );
  return data;
}

/**
 * Submits children's voice recording for analysis
 */
export async function submitChildrenVoice(
  audioBlob: Blob,
  resumeUrl: string,
  storyTitle: string,
  stepNum: number = 1,
  stepType: string = 'gorsel_tahmini',
  sessionId: string = '',
  targetSentences?: string[],
  options?: Level1ApiOptions
): Promise<Level1ChildrenVoiceResponse> {
  const file = new File([audioBlob], 'cocuk_sesi.mp3', { type: 'audio/mp3' });
  const formData = new FormData();
  formData.append('ses', file);
  formData.append('title', storyTitle);
  formData.append('step', String(stepNum));
  formData.append('userId', sessionId || `anon-${Date.now()}`);
  formData.append('stepType', stepType);
  if (targetSentences && targetSentences.length > 0) {
    formData.append('firstSentences', JSON.stringify(targetSentences));
  }

  const { data } = await apiClient.post<Level1ChildrenVoiceResponse>(
    resumeUrl,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' }, meta: { logContext: options?.logContext } } as any
  );
  return data;
}
