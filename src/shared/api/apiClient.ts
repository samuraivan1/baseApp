// src/services/apiClient.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getAuthStore } from '@/features/shell/state/authStore';
// No usamos refresh por body en frontend; refrescamos por cookie HttpOnly
import { getCsrfToken } from './csrf';

// Usa proxy de Vite por defecto ('/api').
// Si defines VITE_API_BASE_URL, se usará directamente (ej.: 'http://localhost:3001').
// En desarrollo usamos same-origin sin prefijo para evitar proxy del dev server,
// las rutas MSW ya admiten ambos: con y sin '/api'.
const baseURL = import.meta.env.MODE === 'development'
  ? '/api'
  : (import.meta.env.VITE_API_BASE_URL || '/api');
const api: AxiosInstance = axios.create({ baseURL, withCredentials: true });
// Helper para obtener el baseURL actual cuando se requiera componer URLs externas puntuales
export const getBaseURL = (): string => (api.defaults.baseURL as string) || '/api';

// Control de refresco concurrente
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];
const enqueue = (cb: (t: string | null) => void) => { refreshQueue.push(cb); };
const flush = (t: string | null) => { refreshQueue.forEach((cb) => cb(t)); refreshQueue = []; };

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthStore().getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  // CSRF para métodos que modifican estado
  const method = (config.method || 'get').toLowerCase();
  if ([ 'post', 'put', 'patch', 'delete' ].includes(method)) {
    const csrf = getCsrfToken();
    if (csrf) {
      (config.headers as Record<string, string>)['X-CSRF-Token'] = csrf;
    }
  }
  return config;
});

api.interceptors.response.use(
  (r) => {
    try {
      const url = r.config?.url || '';
      const data: any = r.data;
      if ((/\/auth\/(login|refresh)/).test(url || '') && data && typeof data.csrf_token === 'string') {
        window.localStorage.setItem('csrf_token', data.csrf_token);
      }
    } catch {}
    return r;
  },
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;
    const url = original?.url || '';
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh');

    if (!original || original._retry || status !== 401 || isAuthEndpoint) {
      if (status === 401 && !isAuthEndpoint) getAuthStore().logout();
      return Promise.reject(error);
    }
    original._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        // Refresh por cookie HttpOnly (recomendado). El backend debe setear la cookie en /auth/login.
        const res = await axios.post(`${baseURL}/auth/refresh`, null, { withCredentials: true });
        const newAccess = res.data?.access_token ?? null;
        if (!newAccess) throw new Error('missing access_token');
        getAuthStore().setToken(newAccess, null);
        isRefreshing = false;
        flush(newAccess);
      } catch (e) {
        isRefreshing = false;
        flush(null);
        getAuthStore().logout();
        return Promise.reject(e);
      }
    }

    return new Promise((resolve, reject) => {
      enqueue((t) => {
        if (!t) return reject(error);
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>).Authorization = `Bearer ${t}`;
        resolve(api(original));
      });
    });
  }
);

export default api;
