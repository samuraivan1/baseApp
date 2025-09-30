// src/services/apiClient.ts
import axios from 'axios';
import { getAuthStore } from '@/store/authStore';
import { refreshToken } from './authService';

// Usa proxy de Vite por defecto ('/api').
// Si defines VITE_API_BASE_URL, se usará directamente (ej.: 'http://localhost:3001').
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = getAuthStore().getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = getAuthStore().getRefreshToken();
      if (refresh) {
        try {
          const { accessToken } = await refreshToken(refresh);
          getAuthStore().setToken(accessToken, refresh);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
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
