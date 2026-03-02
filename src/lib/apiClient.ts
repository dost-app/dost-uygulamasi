import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { logApiCall } from './supabase';

export interface ApiLogContext {
  sessionId: string | null;
  studentId: string;
  storyId: number;
  level: number;
  step: number;
}

const MAX_BODY_LOG_SIZE = 5000;

function sanitizeForLog(obj: any): any {
  if (obj == null) return obj;
  if (typeof obj !== 'object') return obj;
  if (obj instanceof FormData) {
    const entries: Record<string, string> = {};
    obj.forEach((v, k) => {
      if (v instanceof Blob || v instanceof File) {
        entries[k] = `[${v.type || 'blob'} ${(v as File).name || ''} ${(v as Blob).size ?? 0} bytes]`;
      } else {
        entries[k] = String(v).length > 200 ? String(v).slice(0, 200) + '...' : String(v);
      }
    });
    return { _formData: true, ...entries };
  }
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'audioBase64' || k === 'audio' || (typeof v === 'string' && v.length > 500)) {
      out[k] = typeof v === 'string' ? `[base64 ${v.length} chars]` : '[truncated]';
    } else if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      out[k] = sanitizeForLog(v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function truncateForLog(body: any): any {
  const str = typeof body === 'string' ? body : JSON.stringify(sanitizeForLog(body));
  if (str.length <= MAX_BODY_LOG_SIZE) return body === undefined ? null : (typeof body === 'object' ? sanitizeForLog(body) : body);
  return sanitizeForLog(body);
}

const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  (config as any).__logStart = Date.now();
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as AxiosRequestConfig & { meta?: { logContext?: ApiLogContext }; __logStart?: number };
    const ctx = config.meta?.logContext;
    if (ctx && config.__logStart != null) {
      const duration = Date.now() - config.__logStart;
      const requestBody = config.data != null ? truncateForLog(config.data) : null;
      const responseBody = response.data != null ? truncateForLog(response.data) : null;
      logApiCall(
        ctx.sessionId,
        ctx.studentId,
        ctx.storyId,
        ctx.level,
        ctx.step,
        typeof config.url === 'string' ? config.url : response.config.url || '',
        (config.method || 'GET').toUpperCase(),
        requestBody,
        config.headers ? (typeof config.headers === 'object' && !(config.headers as any).append ? config.headers : undefined) : undefined,
        response.status,
        responseBody,
        duration,
        undefined
      ).catch((err) => console.warn('api_log insert failed', err));
    }
    return response;
  },
  (error) => {
    const config = error.config as (AxiosRequestConfig & { meta?: { logContext?: ApiLogContext }; __logStart?: number }) | undefined;
    const ctx = config?.meta?.logContext;
    if (ctx && config?.__logStart != null) {
      const duration = Date.now() - config.__logStart;
      const requestBody = config.data != null ? truncateForLog(config.data) : null;
      const status = error.response?.status;
      const responseBody = error.response?.data != null ? truncateForLog(error.response.data) : null;
      logApiCall(
        ctx.sessionId,
        ctx.studentId,
        ctx.storyId,
        ctx.level,
        ctx.step,
        typeof config.url === 'string' ? config.url : config.url || '',
        (config.method || 'GET').toUpperCase(),
        requestBody,
        config.headers ? (typeof config.headers === 'object' && !(config.headers as any).append ? config.headers : undefined) : undefined,
        status ?? null,
        responseBody,
        duration,
        error.message || String(error)
      ).catch((err) => console.warn('api_log insert failed', err));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
