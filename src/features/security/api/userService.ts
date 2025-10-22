// src/services/userService.ts
import api from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';
import { User, CreateUserRequestDTO, UpdateUserRequestDTO, UpdateUserFlagsDTO } from '@/shared/types/security';
import { type UserResponseDTO, mapUserFromDto } from '@/features/security/types/dto';
// TODO: refine type: service should use DTOs for transport and map to domain via mappers

export async function getUsers(): Promise<User[]> {
  try {
    const res = await api.get<UserResponseDTO[] | { data: UserResponseDTO[] }>('/users');
    const rows = Array.isArray(res.data) ? res.data : (res.data as { data: UserResponseDTO[] }).data;
    return (rows ?? []).map(mapUserFromDto);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getUser(id: number): Promise<User> {
  try {
    const { data } = await api.get<UserResponseDTO>(`/users/${id}`);
    return mapUserFromDto(data);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createUser(input: CreateUserRequestDTO): Promise<User> {
  try {
    const { data } = await api.post<UserResponseDTO>('/users', input);
    return mapUserFromDto(data);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateUserFlags(
  id: number,
  input: UpdateUserFlagsDTO
): Promise<User> {
  const patch: { is_active?: 0 | 1; mfa_enabled?: 0 | 1 } = {};
  if (typeof input.is_active === 'boolean') patch.is_active = input.is_active ? 1 : 0;
  if (typeof input.mfa_enabled === 'boolean') patch.mfa_enabled = input.mfa_enabled ? 1 : 0;

  try {
    const { data } = await api.put<UserResponseDTO>(`/users/${id}`, patch);
    return mapUserFromDto(data);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateUser(
  id: number,
  input: UpdateUserRequestDTO
): Promise<User> {
  try {
    const { data } = await api.put<UserResponseDTO>(`/users/${id}`, input);
    return mapUserFromDto(data);
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
