// src/services/userService.ts
import api from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';
import { User, CreateUserDTO, UpdateUserDTO, UpdateUserFlagsDTO } from '@/shared/types/security';

export async function getUsers(): Promise<User[]> {
  try {
    const { data } = await api.get<User[]>('/users');
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getUser(id: number): Promise<User> {
  try {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createUser(input: CreateUserDTO): Promise<User> {
  try {
    const { data } = await api.post<User>('/users', input);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
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

  try {
    const { data } = await api.patch<User>(`/users/${id}`, patch);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateUser(
  id: number,
  input: UpdateUserDTO
): Promise<User> {
  try {
    const { data } = await api.patch<User>(`/users/${id}`, input);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
}
