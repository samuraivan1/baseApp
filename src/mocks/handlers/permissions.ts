import { http, HttpResponse } from 'msw';
import { db, nextId, persistDb } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';
import { requireCsrfOnMutation } from '../utils/csrf';
import { PERMISSIONS } from '@/features/security/constants/permissions';
import type { Permission } from '@/features/security/types';

function getPermissionsTable(): Permission[] {
  return db.permissions as Permission[];
}

const BASE = '/api/permissions';

export const permissionsHandlers = [
  http.get(BASE, ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    if (!auth.user) return new HttpResponse(null, { status: 401 });
    const denied = ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_PERMISSIONS_VIEW
    );
    if (denied) return denied;
    return HttpResponse.json(getPermissionsTable(), { status: 200 });
  }),

  http.get(`${BASE}/:id`, ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    if (!auth.user) return new HttpResponse(null, { status: 401 });
    const denied = ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_PERMISSIONS_VIEW
    );
    if (denied) return denied;
    const id = Number(params.id);
    const row = getPermissionsTable().find(
      (item) => Number(item.permission_id) === id
    );
    if (!row) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(row, { status: 200 });
  }),

  http.post(BASE, async ({ request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    if (!auth.user) return new HttpResponse(null, { status: 401 });
    const denied = ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_PERMISSIONS_CREATE
    );
    if (denied) return denied;
    const body = (await request.json()) as Partial<Permission>;
    const permission_id = nextId('permissions');
    const row: Permission = {
      permission_id,
      permission_string:
        body.permission_string ?? `permission.${permission_id}`,
      resource: body.resource ?? null,
      scope: body.scope ?? null,
      action: body.action ?? null,
      description: body.description ?? null,
    };
    getPermissionsTable().push(row);
    persistDb();
    return HttpResponse.json(row, { status: 201 });
  }),

  http.put(`${BASE}/:id`, async ({ params, request }) => {
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
    const id = Number(params.id);
    const body = (await request.json()) as Partial<Permission>;
    const permissions = getPermissionsTable();
    const idx = permissions.findIndex(
      (item) => Number(item.permission_id) === id
    );
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    permissions[idx] = {
      ...permissions[idx],
      ...body, // `password_hash` should not be patchable
      permission_id: id,
    } as Permission;
    persistDb();
    return HttpResponse.json(permissions[idx], { status: 200 });
  }),

  http.patch(`${BASE}/:id`, async ({ params, request }) => {
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
    const id = Number(params.id);
    const body = (await request.json()) as Partial<Permission>;
    const permissions = getPermissionsTable();
    const idx = permissions.findIndex(
      (item) => Number(item.permission_id) === id
    );
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    permissions[idx] = {
      ...permissions[idx],
      ...body, // `password_hash` should not be patchable
      permission_id: id,
    } as Permission;
    persistDb();
    return HttpResponse.json(permissions[idx], { status: 200 });
  }),

  http.delete(`${BASE}/:id`, ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    if (!auth.user) return new HttpResponse(null, { status: 401 });
    const denied = ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_PERMISSIONS_DELETE
    );
    if (denied) return denied;
    const id = Number(params.id);
    const permissions = getPermissionsTable();
    const idx = permissions.findIndex(
      (item) => Number(item.permission_id) === id
    );
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    permissions.splice(idx, 1);
    persistDb();
    return new HttpResponse(null, { status: 204 });
  }),
];
