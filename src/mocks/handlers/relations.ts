import { http, HttpResponse, type HttpHandler } from 'msw';
import { db, persistDb } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';
import { requireCsrfOnMutation } from '../utils/csrf';
import { PERMISSIONS } from '@/features/security/constants/permissions';
import type { UserRole, RolePermission } from '@/features/security/types';

const getUserRoles: HttpHandler['resolver'] = ({ request }) => {
  const auth = requireAuth(request);
  if (auth instanceof HttpResponse) return auth;
  const denied = ensurePermission(
    auth.user.user_id,
    PERMISSIONS.SECURITY_ROLES_VIEW
  );
  if (denied) return denied;
  return HttpResponse.json(db.user_roles, { status: 200 });
};

const createUserRole: HttpHandler['resolver'] = async ({ request }) => {
  const csrf = requireCsrfOnMutation(request);
  if (csrf) return csrf;
  const auth = requireAuth(request);
  if (auth instanceof HttpResponse) return auth;
  const denied = ensurePermission(
    auth.user.user_id,
    PERMISSIONS.SECURITY_ROLES_UPDATE
  );
  if (denied) return denied;
  const body = (await request.json()) as Partial<UserRole>;
  const row: UserRole = { ...body } as UserRole;
  db.user_roles.push(row);
  persistDb();
  return HttpResponse.json(row, { status: 201 });
};

const deleteUserRole: HttpHandler['resolver'] = ({ params, request }) => {
  const csrf = requireCsrfOnMutation(request);
  if (csrf) return csrf;
  const auth = requireAuth(request);
  if (auth instanceof HttpResponse) return auth;
  const denied = ensurePermission(
    auth.user.user_id,
    PERMISSIONS.SECURITY_ROLES_UPDATE
  );
  if (denied) return denied;
  const user_id = Number(params.user_id);
  const role_id = Number(params.role_id);
  const idx = db.user_roles.findIndex(
    (r) => Number(r.user_id) === user_id && Number(r.role_id) === role_id
  );
  if (idx === -1) return new HttpResponse(null, { status: 404 });
  db.user_roles.splice(idx, 1);
  persistDb();
  return new HttpResponse(null, { status: 204 });
};

const getRolePermissions: HttpHandler['resolver'] = ({ request }) => {
  const auth = requireAuth(request);
  if (auth instanceof HttpResponse) return auth;
  const denied = ensurePermission(
    auth.user.user_id,
    PERMISSIONS.SECURITY_PERMISSIONS_VIEW
  );
  if (denied) return denied;
  return HttpResponse.json(db.role_permissions, { status: 200 });
};

const createRolePermission: HttpHandler['resolver'] = async ({ request }) => {
  const csrf = requireCsrfOnMutation(request);
  if (csrf) return csrf;
  const auth = requireAuth(request);
  if (auth instanceof HttpResponse) return auth;
  const denied = ensurePermission(
    auth.user.user_id,
    PERMISSIONS.SECURITY_PERMISSIONS_UPDATE
  );
  if (denied) return denied;
  const body = (await request.json()) as Partial<RolePermission>;
  const row: RolePermission = { ...body } as RolePermission;
  db.role_permissions.push(row);
  persistDb();
  return HttpResponse.json(row, { status: 201 });
};

const deleteRolePermission: HttpHandler['resolver'] = ({ params, request }) => {
  const csrf = requireCsrfOnMutation(request);
  if (csrf) return csrf;
  const auth = requireAuth(request);
  if (auth instanceof HttpResponse) return auth;
  const denied = ensurePermission(
    auth.user.user_id,
    PERMISSIONS.SECURITY_PERMISSIONS_UPDATE
  );
  if (denied) return denied;
  const role_id = Number(params.role_id);
  const permission_id = Number(params.permission_id);
  const idx = db.role_permissions.findIndex(
    (r) =>
      Number(r.role_id) === role_id && Number(r.permission_id) === permission_id
  );
  if (idx === -1) return new HttpResponse(null, { status: 404 });
  db.role_permissions.splice(idx, 1);
  persistDb();
  return new HttpResponse(null, { status: 204 });
};

export const relationsHandlers: HttpHandler[] = [
  // user_roles (legacy + api)
  http.get('/user_roles', getUserRoles),
  http.get('/api/user_roles', getUserRoles),
  http.post('/user_roles', createUserRole),
  http.post('/api/user_roles', createUserRole),
  http.delete('/user_roles/:user_id/:role_id', deleteUserRole),
  http.delete('/api/user_roles/:user_id/:role_id', deleteUserRole),

  // role_permissions (legacy + api)
  http.get('/role_permissions', getRolePermissions),
  http.get('/api/role_permissions', getRolePermissions),
  http.post('/role_permissions', createRolePermission),
  http.post('/api/role_permissions', createRolePermission),
  http.delete('/role_permissions/:role_id/:permission_id', deleteRolePermission),
  http.delete(
    '/api/role_permissions/:role_id/:permission_id',
    deleteRolePermission
  ),
];
