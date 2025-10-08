import { http, HttpResponse } from 'msw';
import { db, nextId, persistDb } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';
import { requireCsrfOnMutation } from '../utils/csrf';
import { PERMISSIONS } from '@/features/security/constants/permissions';
import type { Permission } from '@/features/security/types';

const BASE = '/api/permissions';

export const permissionsHandlers = [
  http.get(BASE, ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, PERMISSIONS.SECURITY_PERMISSIONS_VIEW);
    if (denied) return denied;
    return HttpResponse.json(db.permissions, { status: 200 });
  }),

  http.get(`${BASE}/:id`, ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, PERMISSIONS.SECURITY_PERMISSIONS_VIEW);
    if (denied) return denied;
    const id = Number(params.id);
    const row = db.permissions.find((item: any) => Number(item.permission_id) === id);
    if (!row) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(row, { status: 200 });
  }),

  http.post(BASE, async ({ request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, PERMISSIONS.SECURITY_PERMISSIONS_CREATE);
    if (denied) return denied;
    const body = (await request.json()) as Partial<Permission>;
    const permission_id = nextId('permissions');
    const row: Permission = {
      permission_id,
      permission_string: body.permission_string ?? `permission.${permission_id}`,
      description: body.description ?? '',
    };
    db.permissions.push(row as any);
    persistDb();
    return HttpResponse.json(row, { status: 201 });
  }),

  http.put(`${BASE}/:id`, async ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, PERMISSIONS.SECURITY_PERMISSIONS_UPDATE);
    if (denied) return denied;
    const id = Number(params.id);
    const body = (await request.json()) as Partial<Permission>;
    const idx = db.permissions.findIndex((item: any) => Number(item.permission_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.permissions[idx] = { ...db.permissions[idx], ...body, permission_id: id } as any;
    persistDb();
    return HttpResponse.json(db.permissions[idx], { status: 200 });
  }),

  http.patch(`${BASE}/:id`, async ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, PERMISSIONS.SECURITY_PERMISSIONS_UPDATE);
    if (denied) return denied;
    const id = Number(params.id);
    const body = (await request.json()) as Partial<Permission>;
    const idx = db.permissions.findIndex((item: any) => Number(item.permission_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.permissions[idx] = { ...db.permissions[idx], ...body, permission_id: id } as any;
    persistDb();
    return HttpResponse.json(db.permissions[idx], { status: 200 });
  }),

  http.delete(`${BASE}/:id`, ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, PERMISSIONS.SECURITY_PERMISSIONS_DELETE);
    if (denied) return denied;
    const id = Number(params.id);
    const idx = db.permissions.findIndex((item: any) => Number(item.permission_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.permissions.splice(idx, 1);
    persistDb();
    return new HttpResponse(null, { status: 204 });
  }),
];
