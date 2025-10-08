// src/services/authService.ts
import api from './apiClient';
import { UserSession } from '@/shared/types/security';

export type RefreshResponse = {
  access_token: string;
  refresh_token?: string;
  csrf_token?: string;
};

export interface LoginCredentials {
  username: string;
  password: string;
}
export interface LoginResponse {
  user: UserSession;
  access_token: string;
  refresh_token: string;
}

export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', credentials);
  return data;
}
export async function refreshToken(refresh_token: string): Promise<{ access_token: string; refresh_token: string }> {
  const { data } = await api.post<{ access_token: string; refresh_token: string }>('/auth/refresh', { refresh_token });
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getSession(): Promise<{ user: UserSession }> {
  const { data } = await api.get<{ user: UserSession }>('/auth/session');
  return data;
}
