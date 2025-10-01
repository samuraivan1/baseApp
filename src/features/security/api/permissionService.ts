// src/services/permissionService.ts
import api from '@/services/apiClient';
import type { Permission } from '@/types/security';

export async function getPermissions(): Promise<Permission[]> {
  const { data } = await api.get<Permission[]>('/permissions');
  return data;
}
export async function createPermission(
  input: Omit<Permission, 'permission_id'>
): Promise<Permission> {
  const { data } = await api.post<Permission>('/permissions', input);
  return data;
}
export async function updatePermission(
  id: number,
  input: Partial<Omit<Permission, 'permission_id'>>
): Promise<Permission> {
  const { data } = await api.patch<Permission>(`/permissions/${id}`, input);
  return data;
}
export async function deletePermission(id: number): Promise<void> {
  await api.delete(`/permissions/${id}`);
}
