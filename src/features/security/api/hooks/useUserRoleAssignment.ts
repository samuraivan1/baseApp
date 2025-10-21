import { useQueryClient } from '@tanstack/react-query';
import { getUserRoles, addUserRole, removeUserRole } from '@/features/security';
import { userRolesKeys } from '@/features/security/api/queryKeys';

export function useUserRoleAssignment() {
  const qc = useQueryClient();

  const assign = async (userId: number, roleId: number | null | undefined) => {
    // Carga relaciones actuales y asegura una sola relación por usuario
    const relations = await getUserRoles();
    const current = relations.find((ur) => ur.user_id === userId);

    if (current && current.role_id === Number(roleId)) {
      return current; // no-op
    }
    if (current) {
      await removeUserRole(current.id);
    }
    if (roleId != null) {
      const created = await addUserRole(userId, Number(roleId));
      await qc.invalidateQueries({ queryKey: userRolesKeys.all });
      return created;
    }
    await qc.invalidateQueries({ queryKey: userRolesKeys.all });
    return null;
  };

  const clear = async (userId: number) => {
    const relations = await getUserRoles();
    const current = relations.find((ur) => ur.user_id === userId);
    if (current) {
      await removeUserRole(current.id);
      await qc.invalidateQueries({ queryKey: userRolesKeys.all });
    }
  };

  return { assign, clear };
}
