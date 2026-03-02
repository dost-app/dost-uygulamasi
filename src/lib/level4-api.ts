import apiClient from './apiClient';
import type { ApiLogContext } from './apiClient';
import { getApiBase } from './api';
import { getVoiceResponseTimeoutSync } from '../components/SidebarSettings';
import type {
  Level4Step1Request,
  Level4Step1Response,
  Level4Step2Request,
  Level4Step2Response,
} from '../types';

export interface Level4ApiOptions {
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

export async function submitSchemaSectionReading(
  request: Level4Step1Request,
  options?: Level4ApiOptions
): Promise<Level4Step1Response> {
  const response = await apiClient.post<Level4Step1Response>(
    `${getApiBase()}/dost/level4/step1`,
    request,
    {
      headers: { 'Content-Type': 'application/json' },
      meta: { logContext: options?.logContext },
    } as any
  );
  return response.data;
}

export async function getResumeResponse(
  resumeUrl: string,
  request: Level4Step1Request,
  options?: Level4ApiOptions
): Promise<Level4Step1Response> {
  const payload = {
    studentId: request.studentId,
    sectionTitle: request.sectionTitle,
    paragrafText: request.paragrafText,
    audioBase64: request.audioBase64,
    isLatestParagraf: request.isLatestParagraf,
    paragrafNo: request.paragrafNo,
  };
  const formData = toFormData(payload);
  const response = await apiClient.post<Level4Step1Response>(resumeUrl, formData, {
    withCredentials: false,
    timeout: getVoiceResponseTimeoutSync(),
    meta: { logContext: options?.logContext },
  } as any);
  return response.data;
}

export async function submitSchemaSummary(
  request: Level4Step2Request,
  options?: Level4ApiOptions
): Promise<Level4Step2Response> {
  const response = await apiClient.post<Level4Step2Response>(
    `${getApiBase()}/dost/level4/step2`,
    request,
    {
      headers: { 'Content-Type': 'application/json' },
      meta: { logContext: options?.logContext },
    } as any
  );
  return response.data;
}

export async function getResumeResponseStep2(
  resumeUrl: string,
  request: Level4Step2Request,
  options?: Level4ApiOptions
): Promise<Level4Step2Response> {
  const payload = {
    studentId: request.studentId,
    sectionTitle: request.sectionTitle,
    paragrafText: request.paragrafText,
    audioBase64: request.audioBase64,
    isLatestParagraf: request.isLatestParagraf,
    paragrafNo: request.paragrafNo,
  };
  const formData = toFormData(payload);
  const response = await apiClient.post<Level4Step2Response>(resumeUrl, formData, {
    withCredentials: false,
    timeout: 60000,
    meta: { logContext: options?.logContext },
  } as any);
  return response.data;
}
