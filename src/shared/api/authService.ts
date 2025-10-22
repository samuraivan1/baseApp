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
// Refresh de sesión compatible con backends tipo Spring Security
// - Si el backend usa cookie HttpOnly para refresh: llamar sin body
// - Si requiere body, pasar opcionalmente { refresh_token }
export async function refresh(refresh_token?: string): Promise<RefreshResponse> {
  const body = refresh_token ? { refresh_token } : {};
  const { data } = await api.post<RefreshResponse>('/auth/refresh', body as unknown as null);
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getSession(): Promise<{ user: UserSession }> {
  const { data } = await api.get<{ user: UserSession }>('/auth/session');
  return data;
}
