import { useEntityCrud } from './useEntityCrud';
import type { UserRole } from '@/shared/types/security';
import { getUserRoles, addUserRole, removeUserRole } from '@/features/security/api/relationsService';

type UserRoleInput = { user_id: number; role_id: number };

export function useUserRolesCrud() {
  const service = {
    list: getUserRoles,
    create: (input: UserRoleInput) => addUserRole(input.user_id, input.role_id),
    update: async (_id: number, _input: UserRoleInput) => {
      throw new Error('Updating user_role not supported; remove then create');
    },
    remove: (id: number) => removeUserRole(id),
  };
  return useEntityCrud<UserRole, UserRoleInput>('user_roles', service);
}

