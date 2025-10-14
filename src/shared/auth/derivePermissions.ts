import type { Permission } from '@/features/security/types';

type MockDb = {
  user_roles: Array<{ user_id: number; role_id: number }>;
  role_permissions: Array<{ role_id: number; permission_id: number }>;
  permissions: Array<{ permission_id: number; permission_string: string }>;
};

export function derivePermissions(userId: number, db: MockDb | null | undefined): Permission[] {
  if (!db) return [];
  const roleIds = (db.user_roles as Array<{ user_id: number; role_id: number }>)
    .filter((r) => Number(r.user_id) === Number(userId))
    .map((r) => Number(r.role_id));
  if (roleIds.length === 0) return [];
  const permIds = new Set(
    (db.role_permissions as Array<{ role_id: number; permission_id: number }>)
      .filter((rp) => roleIds.includes(Number(rp.role_id)))
      .map((rp) => Number(rp.permission_id))
  );
  const permissions = (db.permissions as Array<{ permission_id: number; permission_string: string }>)
    .filter((p) => permIds.has(Number(p.permission_id)))
    .map(
      (p) =>
        ({
          permission_id: Number(p.permission_id),
          permission_string: String(p.permission_string),
          resource: '',
          action: '',
          scope: '',
          description: '',
          created_at: undefined,
          updated_at: undefined,
        } as Permission)
    );
  return permissions;
}
