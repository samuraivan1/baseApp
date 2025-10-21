// src/services/permissionService.ts
import api from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';
import type { Permission } from '@/shared/types/security';
import {
  type PermissionResponseDTO,
  type CreatePermissionRequestDTO,
  type UpdatePermissionRequestDTO,
  mapPermissionFromDto,
} from '@/features/security/types/dto';

export async function getPermissions(): Promise<Permission[]> {
  try {
    const { data } = await api.get<PermissionResponseDTO[]>('/permissions');
    return data.map(mapPermissionFromDto);
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function createPermission(
  input: CreatePermissionRequestDTO
): Promise<Permission> {
  try {
    const { data } = await api.post<PermissionResponseDTO>('/permissions', input);
    return mapPermissionFromDto(data);
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function updatePermission(
  id: number,
  input: UpdatePermissionRequestDTO
): Promise<Permission> {
  try {
    const { data } = await api.put<PermissionResponseDTO>(`/permissions/${id}`, input);
    return mapPermissionFromDto(data);
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function deletePermission(id: number): Promise<void> {
  try {
    await api.delete(`/permissions/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
}
