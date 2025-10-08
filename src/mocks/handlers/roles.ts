import { http, HttpResponse } from 'msw';
import { db, nextId, persistDb } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';
import { requireCsrfOnMutation } from '../utils/csrf';
import { PERMISSIONS } from '@/features/security/constants/permissions';
import type { Role } from '@/features/security/types';

const BASE = '/api/roles';

export const rolesHandlers = [
  http.get(BASE, ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_ROLES_VIEW
    );
    if (denied) return denied;
    return HttpResponse.json(db.roles, { status: 200 });
  }),

  http.get(`${BASE}/:id`, ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_ROLES_VIEW
    );
    if (denied) return denied;
    const id = Number(params.id);
    const row = db.roles.find((item) => Number(item.role_id) === id);
    if (!row) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(row, { status: 200 });
  }),

  http.post(BASE, async ({ request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_ROLES_CREATE
    );
    if (denied) return denied;
    const body = (await request.json()) as Partial<Role>;
    const role_id = nextId('roles');
    const row: Role = {
      role_id,
      name: body.name ?? `Role ${role_id}`,
      description: body.description ?? '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.roles.push(row as Role);
    persistDb();
    return HttpResponse.json(row, { status: 201 });
  }),

  http.put(`${BASE}/:id`, async ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_ROLES_UPDATE
    );
    if (denied) return denied;
    const id = Number(params.id);
    const body = (await request.json()) as Partial<Role>;
    const idx = db.roles.findIndex((item) => Number(item.role_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.roles[idx] = { ...db.roles[idx], ...body, role_id: id };
    persistDb();
    return HttpResponse.json(db.roles[idx], { status: 200 });
  }),

  http.patch(`${BASE}/:id`, async ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_ROLES_UPDATE
    );
    if (denied) return denied;
    const id = Number(params.id);
    const body = (await request.json()) as Partial<Role>;
    const idx = db.roles.findIndex((item) => Number(item.role_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.roles[idx] = {
      ...db.roles[idx],
      ...body,
      role_id: id,
    };
    persistDb();
    return HttpResponse.json(db.roles[idx], { status: 200 });
  }),

  http.delete(`${BASE}/:id`, ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_ROLES_DELETE
    );
    if (denied) return denied;
    const id = Number(params.id);
    const idx = db.roles.findIndex((item) => Number(item.role_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.roles.splice(idx, 1);
    persistDb();
    return new HttpResponse(null, { status: 204 });
  }),
];
