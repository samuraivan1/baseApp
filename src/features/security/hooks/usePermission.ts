// src/hooks/usePermission.ts
// Combina dos responsabilidades:
// 1) Hook de verificación de permisos de UI: usePermission
// 2) Hooks para CRUD de permisos del catálogo (usePermissions, usePermissionMutations)

import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { createPermission, deletePermission, getPermissions, updatePermission } from '@/features/security/api/permissionService';
import type { Permission } from '@/types/security';
import { ActionPermissions, PagePermissions } from '@/constants/permissions';

// Alias comunes usados en la UI para mapear al string real en BD
const PermissionAlias: Record<string, string> = {
  USER_VIEW: 'user:system:view',
  USER_UPDATE: 'user:system:edit', // en BD está como "edit"
  USER_DELETE: 'user:system:delete',

  ROLE_CREATE: ActionPermissions.ROLE_CREATE,
  ROLE_UPDATE: 'role:system:edit', // en BD está como "edit"
  ROLE_DELETE: ActionPermissions.ROLE_DELETE,

  SEGU_USERS_VIEW: PagePermissions.SEGU_USERS_VIEW,
  SEGU_ROLES_VIEW: PagePermissions.SEGU_ROLES_VIEW,
  SEGU_PERMISSIONS_VIEW: PagePermissions.SEGU_PERMISSIONS_VIEW,
};

export function usePermission(codeOrString: string): boolean {
  const userPerms = useAuthStore(
    (s) => s.user?.permissions?.map((p) => p.permission_string) || []
  );
  return useMemo(() => {
    const target = PermissionAlias[codeOrString] ?? codeOrString;
    return userPerms.includes(target);
  }, [codeOrString, userPerms]);
}

// Catálogo de permisos (API)
export function usePermissions() {
  return useQuery({ queryKey: ['permissions'], queryFn: getPermissions });
}

export function usePermissionMutations() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: (input: Omit<Permission, 'permission_id'>) =>
      createPermission(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['permissions'] }),
  });

  const update = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: Partial<Omit<Permission, 'permission_id'>>;
    }) => updatePermission(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['permissions'] }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deletePermission(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['permissions'] }),
  });

  return { create, update, remove };
}
