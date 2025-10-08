import { useEntityCrud, type EntityService } from './useEntityCrud';
import { useSafeMutation } from '@/shared/hooks/useSafeMutation';
import { rolesKeys } from '@/features/security/api/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import type { Role } from '@/features/security/types/models';
import type { CreateRoleDTO } from '@/features/security/types';
import * as service from '@/features/security/api/roleService';

export function useRolesCrud() {
  const qc = useQueryClient();
  const crudService: EntityService<Role, CreateRoleDTO> = {
    list: service.getRoles,
    create: service.createRole,
    update: (id, input) => service.updateRole(Number(id), input),
    remove: (id) => service.deleteRole(Number(id)),
  };
  const crud = useEntityCrud<Role, CreateRoleDTO>('roles', crudService);
  const create = useSafeMutation<Role, CreateRoleDTO>(service.createRole, {
    onSuccess: () => qc.invalidateQueries({ queryKey: rolesKeys.all }),
  });
  const update = useSafeMutation<Role, { id: number; input: CreateRoleDTO }>(
    ({ id, input }) => service.updateRole(Number(id), input),
    { onSuccess: () => qc.invalidateQueries({ queryKey: rolesKeys.all }) }
  );
  const remove = useSafeMutation<void, number>(
    (id) => service.deleteRole(Number(id)),
    { onSuccess: () => qc.invalidateQueries({ queryKey: rolesKeys.all }) }
  );
  return { ...crud, create, update, remove };
}
