import { http, HttpResponse, type HttpHandler } from 'msw';
import { db, persistDb } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';
import { requireCsrfOnMutation } from '../utils/csrf';
import { PERMISSIONS } from '@/features/security/constants/permissions';
import type { UserRole, RolePermission } from '@/features/security/types';

function getUserRolesTable(): UserRole[] {
  return db.user_roles as UserRole[];
}

function getRolePermissionsTable(): RolePermission[] {
  return db.role_permissions as RolePermission[];
}

const getUserRoles: HttpHandler['resolver'] = ({ request }) => {
  const auth = requireAuth(request);
  if (auth instanceof HttpResponse) return auth;
  if (!auth.user) return new HttpResponse(null, { status: 401 });
  const denied = ensurePermission(
    auth.user.user_id,
    PERMISSIONS.SECURITY_ROLES_VIEW
  );
  if (denied) return denied;
  return HttpResponse.json(getUserRolesTable(), { status: 200 });
};

const createUserRole: HttpHandler['resolver'] = async ({ request }) => {
  const csrf = requireCsrfOnMutation(request);
  if (csrf) return csrf;
  const auth = requireAuth(request);
  if (auth instanceof HttpResponse) return auth;
  if (!auth.user) return new HttpResponse(null, { status: 401 });
  const denied = ensurePermission(
    auth.user.user_id,
    PERMISSIONS.SECURITY_ROLES_UPDATE
  );
  if (denied) return denied;
  const body = (await request.json()) as Partial<UserRole>;
  const user_id = Number(body.user_id);
  const role_id = Number(body.role_id);
  if (!Number.isFinite(user_id) || !Number.isFinite(role_id)) {
    return HttpResponse.json({ message: 'user_id and role_id are required' }, { status: 400 });
  }
  const candidateId = Number(body.id);
  const row: UserRole = {
    id: Number.isFinite(candidateId) ? candidateId : Date.now(),
    user_id,
    role_id,
  };
  getUserRolesTable().push(row);
  persistDb();
  return HttpResponse.json(row, { status: 201 });
};

const deleteUserRole: HttpHandler['resolver'] = ({ params, request }) => {
  const csrf = requireCsrfOnMutation(request);
  if (csrf) return csrf;
  const auth = requireAuth(request);
  if (auth instanceof HttpResponse) return auth;
  if (!auth.user) return new HttpResponse(null, { status: 401 });
  const denied = ensurePermission(
    auth.user.user_id,
    PERMISSIONS.SECURITY_ROLES_UPDATE
  );
  if (denied) return denied;
  const user_id = Number(params.user_id);
  const role_id = Number(params.role_id);
  const table = getUserRolesTable();
  const idx = table.findIndex(
    (r) => Number(r.user_id) === user_id && Number(r.role_id) === role_id
  );
  if (idx === -1) return new HttpResponse(null, { status: 404 });
  table.splice(idx, 1);
  persistDb();
  return new HttpResponse(null, { status: 204 });
};

const getRolePermissions: HttpHandler['resolver'] = ({ request }) => {
  const auth = requireAuth(request);
  if (auth instanceof HttpResponse) return auth;
  if (!auth.user) return new HttpResponse(null, { status: 401 });
  const denied = ensurePermission(
    auth.user.user_id,
    PERMISSIONS.SECURITY_PERMISSIONS_VIEW
  );
  if (denied) return denied;
  return HttpResponse.json(getRolePermissionsTable(), { status: 200 });
};

const createRolePermission: HttpHandler['resolver'] = async ({ request }) => {
  const csrf = requireCsrfOnMutation(request);
  if (csrf) return csrf;
  const auth = requireAuth(request);
  if (auth instanceof HttpResponse) return auth;
  if (!auth.user) return new HttpResponse(null, { status: 401 });
  const denied = ensurePermission(
    auth.user.user_id,
    PERMISSIONS.SECURITY_PERMISSIONS_UPDATE
  );
  if (denied) return denied;
  const body = (await request.json()) as Partial<RolePermission>;
  const role_id = Number(body.role_id);
  const permission_id = Number(body.permission_id);
  if (!Number.isFinite(role_id) || !Number.isFinite(permission_id)) {
    return HttpResponse.json({ message: 'role_id and permission_id are required' }, { status: 400 });
  }
  const candidateId = Number(body.id);
  const row: RolePermission = {
    id: Number.isFinite(candidateId) ? candidateId : Date.now(),
    role_id,
    permission_id,
  };
  getRolePermissionsTable().push(row);
  persistDb();
  return HttpResponse.json(row, { status: 201 });
};

const deleteRolePermission: HttpHandler['resolver'] = ({ params, request }) => {
  const csrf = requireCsrfOnMutation(request);
  if (csrf) return csrf;
  const auth = requireAuth(request);
  if (auth instanceof HttpResponse) return auth;
  if (!auth.user) return new HttpResponse(null, { status: 401 });
  const denied = ensurePermission(
    auth.user.user_id,
    PERMISSIONS.SECURITY_PERMISSIONS_UPDATE
  );
  if (denied) return denied;
  const role_id = Number(params.role_id);
  const permission_id = Number(params.permission_id);
  const table = getRolePermissionsTable();
  const idx = table.findIndex(
    (r) =>
      Number(r.role_id) === role_id && Number(r.permission_id) === permission_id
  );
  if (idx === -1) return new HttpResponse(null, { status: 404 });
  table.splice(idx, 1);
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
