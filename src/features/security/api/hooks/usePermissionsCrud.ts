import { useEntityCrud } from './useEntityCrud';
import type { Permission } from '@/shared/types/security';
import { getPermissions, createPermission, updatePermission, deletePermission } from '../permissionService';
import type { CreatePermissionRequestDTO, UpdatePermissionRequestDTO } from '@/features/security/types/dto';
import { useSafeMutation } from '@/shared/hooks/useSafeMutation';
import { permissionsKeys } from '@/features/security/api/queryKeys';
import { useQueryClient } from '@tanstack/react-query';

// UI keeps domain `Permission`; transport uses DTOs
type CreateInput = CreatePermissionRequestDTO;
type UpdateInput = UpdatePermissionRequestDTO;

export function usePermissionsCrud() {
  const service: EntityService<Permission, CreateInput> = {
    list: getPermissions,
    create: (input) => createPermission(input),
    update: (id, input: CreateInput | UpdateInput) => updatePermission(Number(id), input as UpdateInput),
    remove: (id) => deletePermission(Number(id)),
  };
  const crud = useEntityCrud<Permission, CreateInput>('permissions', service);
  const qc = useQueryClient();
  const create = useSafeMutation<Permission, CreateInput>(
    (input) => createPermission(input),
    { onSuccess: () => qc.invalidateQueries({ queryKey: permissionsKeys.all }) }
  );
  const update = useSafeMutation<Permission, { id: number; input: UpdateInput }>(
    ({ id, input }) => updatePermission(id, input),
    { onSuccess: () => qc.invalidateQueries({ queryKey: permissionsKeys.all }) }
  );
  const remove = useSafeMutation<void, number>(
    (id) => deletePermission(id),
    { onSuccess: () => qc.invalidateQueries({ queryKey: permissionsKeys.all }) }
  );
  return { ...crud, create, update, remove };
}
