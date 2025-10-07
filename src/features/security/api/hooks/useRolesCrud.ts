import { useEntityCrud } from './useEntityCrud';
import type { Role, RoleInput } from '@/features/security/types/models';
import * as service from '@/features/security/api/roleService';

export function useRolesCrud() {
  return useEntityCrud<Role, RoleInput>('roles', {
    list: service.getRoles,
    create: service.createRole,
    update: (id, input) => service.updateRole(Number(id), input),
    remove: (id) => service.deleteRole(Number(id)),
  });
}

