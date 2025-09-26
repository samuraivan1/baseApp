// src/services/apiClient.ts
import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { getConfig } from './configService';
import errorService, { normalizeError } from './errorService';
import { getAuthStore } from '@/store/authStore';

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

const apiClient = axios.create({
  // El baseURL se asignará dinámicamente en el interceptor.
  timeout: 15000,
});

let isRefreshing = false; type FailedQueuedItem = {
  resolve: (token: string | null) => void;
  reject: (e: unknown) => void;
  originalRequest: AxiosRequestConfig & { _retry?: boolean };
};
let failedQueue: FailedQueuedItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

// Request interceptor: añadir Authorization header y baseURL dinámico
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // BaseURL dinámico desde el config cargado
    try {
      const appConfig = getConfig();
      config.baseURL = appConfig.API_BASE_URL;
    } catch {
      // Si no está cargado aún, dejamos que la request falle y se normalice abajo
    }

    // Establecer token + cabeceras comunes respetando AxiosHeaders cuando exista
    const authStore = getAuthStore();
    const token = authStore.getToken?.() ?? null;
    const h = config.headers as any;
    if (h && typeof h.set === 'function') {
      if (token) h.set('Authorization', `Bearer ${token}`);
      h.set('X-Requested-With', 'XMLHttpRequest');
    } else {
      config.headers = {
        ...(config.headers as any),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'X-Requested-With': 'XMLHttpRequest',
      } as any;
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
  async (error: AxiosError) => {
    const originalRequest = (error.config ?? {}) as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const authStore = getAuthStore();

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, originalRequest });
        })
          .then((token) => {
            const oh = originalRequest.headers as any;
            if (oh && typeof oh.set === 'function') {
              if (token) oh.set('Authorization', `Bearer ${token}`);
            } else {
              originalRequest.headers = {
                ...(originalRequest.headers as any),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              } as any;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = authStore.getRefreshToken?.();
        const { API_BASE_URL } = getConfig();
        const { data } = await axios.post<RefreshResponse>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );
        authStore.setToken?.(data.accessToken, data.refreshToken);
        processQueue(null, data.accessToken);
        const oh = originalRequest.headers as any;
        if (oh && typeof oh.set === 'function') {
          oh.set('Authorization', `Bearer ${data.accessToken}`);
        } else {
          originalRequest.headers = {
            ...(originalRequest.headers as any),
            Authorization: `Bearer ${data.accessToken}`,
          } as any;
        }
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
