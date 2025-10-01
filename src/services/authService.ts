// src/services/authService.ts
import api from './apiClient';
import { UserSession } from '@/types/security';

export interface LoginCredentials {
  username: string;
  password: string;
}
export interface LoginResponse {
  user: UserSession;
  accessToken: string;
  refreshToken?: string | null;
}

export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', credentials);
  return data;
}
export async function refreshToken(
  refreshToken: string
): Promise<{ accessToken: string }> {
  const { data } = await api.post<{ accessToken: string }>('/auth/refresh', {
    refreshToken,
  });
  return data;
}
