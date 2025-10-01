// src/services/userService.ts
import api from '@/services/apiClient';
import { User, CreateUserDTO, UpdateUserDTO, UpdateUserFlagsDTO } from '@/types/security';

export async function getUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>('/users');
  return data;
}

export async function getUser(id: number): Promise<User> {
  const { data } = await api.get<User>(`/users/${id}`);
  return data;
}

export async function createUser(input: CreateUserDTO): Promise<User> {
  const { data } = await api.post<User>('/users', input);
  return data;
}

export async function updateUserFlags(
  id: number,
  input: UpdateUserFlagsDTO
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

export async function updateUser(
  id: number,
  input: UpdateUserDTO
): Promise<User> {
  const { data } = await api.patch<User>(`/users/${id}`, input);
  return data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}
