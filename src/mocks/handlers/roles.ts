import { http, HttpResponse } from 'msw';
import { db, nextId, persistDb } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';
import { requireCsrfOnMutation } from '../utils/csrf';

const BASE = '/api/roles';

export const rolesHandlers = [
  http.get(BASE, ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'role:system:read');
    if (denied) return denied;
    return HttpResponse.json(db.roles, { status: 200 });
  }),

  http.post('/roles', async (ctx) => rolesHandlers[3].resolver(ctx)),
  http.post(BASE, async ({ request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'role:system:create');
    if (denied) return denied;
    const body = await request.json();
    const role_id = nextId('roles');
    const row = { ...body, role_id };
    db.roles.push(row);
    persistDb();
    return HttpResponse.json(row, { status: 201 });
  }),

  http.delete('/roles/:id', (ctx) => rolesHandlers[5].resolver(ctx)),
  http.delete(`${BASE}/:id`, ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'role:system:delete');
    if (denied) return denied;
    const id = Number(params.id);
    const idx = db.roles.findIndex((r: any) => Number(r.role_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.roles.splice(idx, 1);
    persistDb();
    return new HttpResponse(null, { status: 204 });
  }),

  // GET role permissions: /api/roles/:id/permissions
  http.get(`${BASE}/:id/permissions`, ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'role:system:read');
    if (denied) return denied;
    const role_id = Number(params.id);
    const items = db.role_permissions.filter((rp: any) => Number(rp.role_id) === role_id);
    return HttpResponse.json(items, { status: 200 });
  }),

  // POST assign permissions to role: { permission_ids: number[] }
  http.post(`${BASE}/:id/permissions`, async ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'role:system:edit');
    if (denied) return denied;
    const role_id = Number(params.id);
    const body = (await request.json()) as { permission_ids?: number[] };
    const ids = Array.isArray(body.permission_ids) ? body.permission_ids : [];
    // Generate incremental id avoiding reliance on inferIdField
    let maxId = db.role_permissions.reduce((m: number, r: any) => Math.max(m, Number(r.id ?? 0)), 0);
    for (const permission_id of ids) {
      const exists = db.role_permissions.some(
        (r: any) => Number(r.role_id) === role_id && Number(r.permission_id) === Number(permission_id)
      );
      if (!exists) {
        maxId += 1;
        db.role_permissions.push({ id: maxId, role_id, permission_id });
      }
    }
    persistDb();
    const items = db.role_permissions.filter((rp: any) => Number(rp.role_id) === role_id);
    return HttpResponse.json(items, { status: 200 });
  }),
];
