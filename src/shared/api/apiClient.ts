// src/services/apiClient.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getAuthStore } from '@/features/shell/state/authStore';
import { refreshToken } from './authService';

// Usa proxy de Vite por defecto ('/api').
// Si defines VITE_API_BASE_URL, se usará directamente (ej.: 'http://localhost:3001').
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
const api: AxiosInstance = axios.create({ baseURL });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthStore().getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = getAuthStore().getRefreshToken();
      if (refresh) {
        try {
          const tokens = await refreshToken(refresh);
          const newAccess = tokens.access_token;
          const newRefresh = tokens.refresh_token ?? refresh;
          getAuthStore().setToken(newAccess, newRefresh);
          if (!originalRequest.headers) originalRequest.headers = {};
          (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch {
          getAuthStore().logout();
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
