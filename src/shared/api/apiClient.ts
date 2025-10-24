import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getAuthStore } from '@/features/shell/state/authStore';
import { getCsrfToken, setCsrfToken } from './csrf';
import { API_ENDPOINTS } from '@/constants/apiConstants';
import { ensureTraceId, setTraceId } from '@/shared/observability/trace';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
const api: AxiosInstance = axios.create({ baseURL, withCredentials: true });

export const getBaseURL = (): string => api.defaults.baseURL || '/api';

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

const enqueue = (cb: (token: string | null) => void) => {
  refreshQueue.push(cb);
};

const flush = (token: string | null) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Ensure and attach x-trace-id
  const traceId = ensureTraceId();
  config.headers['x-trace-id'] = traceId;

  const token = getAuthStore().getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const method = (config.method || 'get').toLowerCase();
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    const csrf = getCsrfToken();
    if (csrf) {
      config.headers['X-CSRF-Token'] = csrf;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const url = response.config?.url || '';
    const data = response.data;

    // If backend echoes trace id, keep local in sync
    const resHeaders = response.headers as Record<string, unknown> | undefined;
    const resTrace = (resHeaders && typeof resHeaders['x-trace-id'] === 'string' ? (resHeaders['x-trace-id'] as string) : undefined) ||
      (data && typeof (data as Record<string, unknown>).traceId === 'string' ? (data as Record<string, unknown>).traceId as string : undefined);
    if (typeof resTrace === 'string' && resTrace) setTraceId(resTrace);

    if (
      (url.includes(API_ENDPOINTS.LOGIN) || url.includes(API_ENDPOINTS.REFRESH)) &&
      data && typeof data.csrf_token === 'string'
    ) {
      setCsrfToken(data.csrf_token);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const url = originalRequest.url || '';

    // Attempt to sync trace id from error response
    const errHeaders = error.response?.headers as Record<string, unknown> | undefined;
    const errData = error.response?.data as Record<string, unknown> | undefined;
    const errTrace = (errHeaders && typeof errHeaders['x-trace-id'] === 'string' ? (errHeaders['x-trace-id'] as string) : undefined) ||
      (errData && typeof errData.traceId === 'string' ? (errData.traceId as string) : undefined);
    if (typeof errTrace === 'string' && errTrace) setTraceId(errTrace);

    const isAuthEndpoint = url.includes(API_ENDPOINTS.LOGIN) || url.includes(API_ENDPOINTS.REFRESH);

    if (!originalRequest || originalRequest._retry || status !== 401 || isAuthEndpoint) {
      if (status === 401 && !isAuthEndpoint) {
        try {
          const { normalizeError } = await import('@/shared/api/errorService');
          const svc = (await import('@/shared/api/errorService')).default;
          svc.logError(normalizeError(error, { where: 'auth.401.autoLogout', url }));
        } catch { /* noop */ }
        getAuthStore().logout();
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const response = await axios.post(`${baseURL}${API_ENDPOINTS.REFRESH}`, null, { withCredentials: true });
        const newAccessToken = response.data?.access_token;

        if (!newAccessToken) {
          throw new Error('Missing access_token in refresh response');
        }

        getAuthStore().setToken(newAccessToken);
        try {
          const svc = (await import('@/shared/api/errorService')).default;
          svc.captureBreadcrumb?.({ message: 'Token refreshed', category: 'auth', data: { where: 'auth.refresh.success' } });
        } catch { /* noop */ }
        isRefreshing = false;
        flush(newAccessToken);
      } catch (e) {
        isRefreshing = false;
        flush(null);
        try {
          const { normalizeError } = await import('@/shared/api/errorService');
          const svc = (await import('@/shared/api/errorService')).default;
          svc.logError(normalizeError(e, { where: 'auth.refresh.failure' }));
        } catch { /* noop */ }
        getAuthStore().logout();
        return Promise.reject(e);
      }
    }

    return new Promise((resolve, reject) => {
      enqueue((token) => {
        if (!token) {
          return reject(error);
        }
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(api(originalRequest));
      });
    });
  }
);

export default api;
