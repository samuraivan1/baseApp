import { useEntityCrud } from './useEntityCrud';
import type { Permission } from '@/shared/types/security';
import { getPermissions, createPermission, updatePermission, deletePermission } from '../permissionService';
import { useSafeMutation } from '@/shared/hooks/useSafeMutation';
import { permissionsKeys } from '@/features/security/api/queryKeys';
import { useQueryClient } from '@tanstack/react-query';

type PermissionInput = Omit<Permission, 'permission_id'>;

export function usePermissionsCrud() {
  const service = {
    list: getPermissions,
    create: (input: PermissionInput) => createPermission(input),
    update: (id: number, input: PermissionInput) => updatePermission(id, input),
    remove: (id: number) => deletePermission(id),
  };
  const crud = useEntityCrud<Permission, PermissionInput>('permissions', service);
  const qc = useQueryClient();
  const create = useSafeMutation<Permission, PermissionInput>(
    (input) => createPermission(input),
    { onSuccess: () => qc.invalidateQueries({ queryKey: permissionsKeys.all }) }
  );
  const update = useSafeMutation<Permission, { id: number; input: PermissionInput }>(
    ({ id, input }) => updatePermission(id, input),
    { onSuccess: () => qc.invalidateQueries({ queryKey: permissionsKeys.all }) }
  );
  const remove = useSafeMutation<void, number>(
    (id) => deletePermission(id),
    { onSuccess: () => qc.invalidateQueries({ queryKey: permissionsKeys.all }) }
  );
  return { ...crud, create, update, remove };
}
