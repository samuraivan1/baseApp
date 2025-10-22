import api from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';
import type { RolePermission, UserRole } from '@/shared/types/security';

export async function getRolePermissions(): Promise<RolePermission[]> {
  try {
    const { data } = await api.get<RolePermission[]>('/role_permissions');
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function addRolePermission(
  role_id: number,
  permission_id: number
) {
  try {
    const { data } = await api.post<RolePermission>('/role_permissions', {
      role_id,
      permission_id,
    });
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function removeRolePermission(id: number) {
  try {
    await api.delete(`/role_permissions/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
}

// Some backends (or mocks) use a compound route to delete a relation
// Provide an explicit helper for that contract as well
export async function removeRolePermissionByPair(role_id: number, permission_id: number) {
  try {
    await api.delete(`/role_permissions/${role_id}/${permission_id}`);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getUserRoles(): Promise<UserRole[]> {
  try {
    const { data } = await api.get<UserRole[]>('/user_roles');
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function addUserRole(user_id: number, role_id: number) {
  try {
    const { data } = await api.post<UserRole>('/user_roles', {
      user_id,
      role_id,
    });
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function removeUserRole(id: number) {
  try {
    await api.delete(`/user_roles/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
}
