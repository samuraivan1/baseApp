// src/services/apiClient.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
// ✅ 1. CORRECCIÓN: Usa una importación con nombre.
import { getConfig } from './configService';
import errorService, { normalizeError } from './errorService';
import { getAuthStore } from '@/store/authStore';

// ❌ Se elimina la asignación de BASE_URL de aquí.

const apiClient = axios.create({
  // El baseURL se asignará dinámicamente en el interceptor.
  timeout: 15000,
});

// ... (las funciones processQueue y la variable failedQueue se mantienen igual) ...
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (v: any) => void;
  reject: (e: any) => void;
  originalRequest: any;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

// Request interceptor: añadir Authorization header y baseURL dinámico
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ✅ 2. OBTÉN LA CONFIGURACIÓN AQUÍ: Justo antes de cada petición.
    const appConfig = getConfig();
    config.baseURL = appConfig.API_BASE_URL;

    const authStore = getAuthStore();
    const token = authStore.getToken?.() ?? null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    const norm = normalizeError(error, { phase: 'request' });
    errorService.logError(norm);
    return Promise.reject(error);
  }
);

// Response interceptor: handle 401 refresh logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: any }) => {
    const originalRequest = error.config;
    const authStore = getAuthStore();

    if (error.response?.status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject, originalRequest });
        })
          .then((token) => {
            if (originalRequest.headers)
              originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = authStore.getRefreshToken?.();
        // ✅ 3. USA LA CONFIGURACIÓN DINÁMICA TAMBIÉN AQUÍ
        const { API_BASE_URL } = getConfig();
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        authStore.setToken?.(data.accessToken, data.refreshToken);
        processQueue(null, data.accessToken);
        if (originalRequest.headers)
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (e) {
        processQueue(e, null);
        authStore.logout?.();
        const norm = normalizeError(e, { phase: 'refresh' });
        errorService.logError(norm);
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    const norm = normalizeError(error, { phase: 'response' });
    errorService.logError(norm);
    (error as any).normalized = norm;
    return Promise.reject(error);
  }
);

export default apiClient;
