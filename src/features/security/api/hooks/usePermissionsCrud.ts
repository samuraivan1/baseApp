import { useEntityCrud } from './useEntityCrud';
import type { Permission } from '@/shared/types/security';
import { getPermissions, createPermission, updatePermission, deletePermission } from '../permissionService';

type PermissionInput = Omit<Permission, 'permission_id'>;

export function usePermissionsCrud() {
  const service = {
    list: getPermissions,
    create: (input: PermissionInput) => createPermission(input),
    update: (id: number, input: PermissionInput) => updatePermission(id, input),
    remove: (id: number) => deletePermission(id),
  };
  return useEntityCrud<Permission, PermissionInput>('permissions', service);
}

