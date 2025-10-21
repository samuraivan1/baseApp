import { useEntityCrud } from './useEntityCrud';
import type { EntityService } from './useEntityCrud';
import { useSafeMutation } from '@/shared/hooks/useSafeMutation';
import { rolesKeys } from '@/features/security/api/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import type { IRole as Role } from '@/features/security/types/models';
import type { CreateRoleRequestDTO } from '@/features/security/types';
import * as service from '@/features/security/api/roleService';

export function useRolesCrud() {
  const qc = useQueryClient();
  const crudService: EntityService<Role, CreateRoleRequestDTO> = {
    list: service.getRoles,
    create: service.createRole,
    update: (id: number | string, input: CreateRoleRequestDTO) => service.updateRole(Number(id), input),
    remove: (id: number | string) => service.deleteRole(Number(id)),
  };
  const crud = useEntityCrud<Role, CreateRoleRequestDTO>('roles', crudService);
  const create = useSafeMutation<Role, CreateRoleRequestDTO>(service.createRole, {
    onSuccess: () => qc.invalidateQueries({ queryKey: rolesKeys.all }),
  });
  const update = useSafeMutation<Role, { id: number; input: CreateRoleRequestDTO }>(
    ({ id, input }) => service.updateRole(Number(id), input),
    { onSuccess: () => qc.invalidateQueries({ queryKey: rolesKeys.all }) }
  );
  const remove = useSafeMutation<void, number>(
    (id) => service.deleteRole(Number(id)),
    { onSuccess: () => qc.invalidateQueries({ queryKey: rolesKeys.all }) }
  );
  return { ...crud, create, update, remove };
}
