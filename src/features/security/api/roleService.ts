// src/services/roleService.ts
import api from '@/services/apiClient';
import { Role, CreateRoleDTO, UpdateRoleDTO } from '@/types/security';

export async function getRoles(): Promise<Role[]> {
  const { data } = await api.get<Role[]>('/roles');
  return data;
}
export async function createRole(input: CreateRoleDTO): Promise<Role> {
  const { data } = await api.post<Role>('/roles', input);
  return data;
}
export async function updateRole(
  id: number,
  input: UpdateRoleDTO
): Promise<Role> {
  const { data } = await api.patch<Role>(`/roles/${id}`, input);
  return data;
}
export async function deleteRole(id: number): Promise<void> {
  await api.delete(`/roles/${id}`);
}
