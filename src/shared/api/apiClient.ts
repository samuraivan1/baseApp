import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getAuthStore } from '@/features/shell/state/authStore';
import { getCsrfToken, setCsrfToken } from './csrf';
import { API_ENDPOINTS } from '@/constants/apiConstants';

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

    const isAuthEndpoint = url.includes(API_ENDPOINTS.LOGIN) || url.includes(API_ENDPOINTS.REFRESH);

    if (!originalRequest || originalRequest._retry || status !== 401 || isAuthEndpoint) {
      if (status === 401 && !isAuthEndpoint) {
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
        isRefreshing = false;
        flush(newAccessToken);
      } catch (e) {
        isRefreshing = false;
        flush(null);
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
