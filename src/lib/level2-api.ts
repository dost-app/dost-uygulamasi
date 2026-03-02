import apiClient from './apiClient';
import type { ApiLogContext } from './apiClient';
import { getApiBase } from './api';
import type {
  Level2Step1ReadingAnalysisRequest,
  Level2Step1ReadingAnalysisResponse,
  Level2Step3GoalSelectionRequest,
  Level2Step3GoalSelectionResponse,
} from '../types';

export interface Level2ApiOptions {
  logContext?: ApiLogContext;
}

/**
 * Level 2 Step 1 - Okuma analizi API'si
 */
export async function submitReadingAnalysis(
  request: Level2Step1ReadingAnalysisRequest,
  options?: Level2ApiOptions
): Promise<Level2Step1ReadingAnalysisResponse> {
  const response = await apiClient.post<Level2Step1ReadingAnalysisResponse>(
    `${getApiBase()}/dost/level2/step1`,
    request,
    {
      headers: { 'Content-Type': 'application/json' },
      meta: { logContext: options?.logContext },
    } as any
  );
  return response.data;
}

/**
 * Level 2 Step 3 - Hedef seçimi API'si
 */
export async function submitReadingGoalSelection(
  request: Level2Step3GoalSelectionRequest,
  options?: Level2ApiOptions
): Promise<Level2Step3GoalSelectionResponse> {
  const response = await apiClient.post<Level2Step3GoalSelectionResponse>(
    `${getApiBase()}/dost/level2/step3`,
    request,
    {
      headers: { 'Content-Type': 'application/json' },
      meta: { logContext: options?.logContext },
    } as any
  );
  return response.data;
}
