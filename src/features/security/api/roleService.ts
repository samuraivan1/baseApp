// src/services/roleService.ts
import api from '@/services/apiClient';
import { Role } from './security.types';

export async function getRoles(): Promise<Role[]> {
  const { data } = await api.get<Role[]>('/roles');
  return data;
}
export async function createRole(input: Omit<Role, 'role_id'>): Promise<Role> {
  const { data } = await api.post<Role>('/roles', input);
  return data;
}
export async function updateRole(
  id: number,
  input: Partial<Omit<Role, 'role_id'>>
): Promise<Role> {
  const { data } = await api.patch<Role>(`/roles/${id}`, input);
  return data;
}
export async function deleteRole(id: number): Promise<void> {
  await api.delete(`/roles/${id}`);
}
