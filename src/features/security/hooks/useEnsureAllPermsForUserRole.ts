import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiCall } from '@/shared/api/apiCall';
import { getUsers, getUserRoles, getPermissions, assignPermissionsToRole, getRolePermissions as getRolePermissionsForRole } from '@/features/security';

// This hook ensures the role assigned to the target user has all permissions.
// It is idempotent and only runs once after data is loaded.
export function useEnsureAllPermsForUserRole(targetUsernames: string[] = ['iamendezm'], targetIds: number[] = [1]) {
  const { data: users = [] } = useQuery({
    queryKey: ['usuarios'],
    queryFn: getUsers,
  });
  const { data: relations = [] } = useQuery({
    queryKey: ['userRoles'],
    queryFn: getUserRoles,
  });
  const { data: perms = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
  });

  useEffect(() => {
    if (!users.length || !relations.length || !perms.length) return;
    const target = users.find(u => targetIds.includes(u.user_id) || targetUsernames.includes(u.username));
    if (!target) return;
    const rel = relations.find(r => r.user_id === target.user_id);
    const roleId = rel?.role_id;
    if (!roleId) return;

    (async () => {
      const existingRes = await apiCall(() => getRolePermissionsForRole(roleId), { where: 'security.role_permissions.list', toastOnError: true });
      if (!existingRes.ok) return;
      const existingSet = new Set(existingRes.value.map(e => e.permission_id));
      const toAssign = perms.map(p => p.permission_id).filter(id => !existingSet.has(id));
      if (toAssign.length > 0) {
        await apiCall(() => assignPermissionsToRole(roleId, toAssign), { where: 'security.role_permissions.assign', toastOnError: true });
      }
    })();
  }, [users, relations, perms, targetUsernames, targetIds]);
}
