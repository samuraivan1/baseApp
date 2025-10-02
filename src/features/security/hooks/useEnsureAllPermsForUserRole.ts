import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/features/security/api/userService';
import { getUserRoles } from '@/features/security/api/relationsService';
import { getPermissions } from '@/features/security/api/permissionService';
import { assignPermissionsToRole, getRolePermissions } from '@/features/security/api/roleService';

// This hook ensures the role assigned to the target user has all permissions.
// It is idempotent and only runs once after data is loaded.
export function useEnsureAllPermsForUserRole(targetUsernames: string[] = ['iamendezm'], targetIds: number[] = [1]) {
  const { data: users = [] } = useQuery({ queryKey: ['usuarios'], queryFn: getUsers });
  const { data: relations = [] } = useQuery({ queryKey: ['userRoles'], queryFn: getUserRoles });
  const { data: perms = [] } = useQuery({ queryKey: ['permisos'], queryFn: getPermissions });

  useEffect(() => {
    if (!users.length || !relations.length || !perms.length) return;
    const target = users.find(u => targetIds.includes(u.user_id) || targetUsernames.includes(u.username));
    if (!target) return;
    const rel = relations.find(r => r.user_id === target.user_id);
    const roleId = rel?.role_id;
    if (!roleId) return;

    (async () => {
      try {
        const existing = await getRolePermissions(roleId);
        const existingSet = new Set(existing.map(e => e.permission_id));
        const toAssign = perms.map(p => p.permission_id).filter(id => !existingSet.has(id));
        if (toAssign.length > 0) {
          await assignPermissionsToRole(roleId, toAssign);
        }
      } catch {
        // Swallow errors to avoid blocking UI; logging handled by callers usually.
        // console.error(e);
      }
    })();
  }, [users, relations, perms, targetUsernames, targetIds]);
}
