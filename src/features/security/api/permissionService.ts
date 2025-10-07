// src/services/permissionService.ts
import api from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';
import type { Permission } from '@/shared/types/security';

export async function getPermissions(): Promise<Permission[]> {
  try {
    const { data } = await api.get<Permission[]>('/permissions');
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function createPermission(
  input: Omit<Permission, 'permission_id'>
): Promise<Permission> {
  try {
    const { data } = await api.post<Permission>('/permissions', input);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function updatePermission(
  id: number,
  input: Omit<Permission, 'permission_id'>
): Promise<Permission> {
  try {
    const { data } = await api.put<Permission>(`/permissions/${id}`, input);
    return data;
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
