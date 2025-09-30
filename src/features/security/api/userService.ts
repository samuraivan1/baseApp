// src/services/userService.ts
import api from '@/services/apiClient';
import { User } from './security.types';

export async function getUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>('/users');
  return data;
}

export async function getUser(id: number): Promise<User> {
  const { data } = await api.get<User>(`/users/${id}`);
  return data;
}

export type CreateUserInput = {
  username: string;
  email: string;
  first_name: string;
  last_name_p: string;
  last_name_m?: string | null;
  initials?: string | null;
  password_hash?: string;
  is_active?: boolean | 0 | 1;
  mfa_enabled?: boolean | 0 | 1;
  // optional profile/identity fields
  auth_provider?: string | null;
  email_verified_at?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  phone_number?: string | null;
  azure_ad_object_id?: string | null;
  upn?: string | null;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export async function createUser(input: CreateUserInput): Promise<User> {
  const { data } = await api.post<User>('/users', input);
  return data;
}

export type UpdateUserFlagsInput = {
  is_active?: boolean;
  mfa_enabled?: boolean;
};

export async function updateUserFlags(
  id: number,
  input: UpdateUserFlagsInput
): Promise<User> {
  const patch: Partial<User> = {};

  if (typeof input.is_active === 'boolean') {
    patch.is_active = input.is_active ? 1 : 0;
  }
  if (typeof input.mfa_enabled === 'boolean') {
    patch.mfa_enabled = input.mfa_enabled ? 1 : 0;
  }

  const { data } = await api.patch<User>(`/users/${id}`, patch);
  return data;
}

export type UpdateUserInput = Partial<
  Omit<
    CreateUserInput,
    'is_active' | 'mfa_enabled'
  > & { is_active: boolean | 0 | 1; mfa_enabled: boolean | 0 | 1 }
>;

export async function updateUser(
  id: number,
  input: UpdateUserInput
): Promise<User> {
  const { data } = await api.patch<User>(`/users/${id}`, input);
  return data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}
