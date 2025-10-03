import { http, HttpResponse } from 'msw';
import { db, nextId, persistDb } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';
import { requireCsrfOnMutation } from '../utils/csrf';

const BASE = '/api/permissions';

export const permissionsHandlers = [
  // Legacy
  http.get('/permissions', (ctx) => permissionsHandlers[1].resolver(ctx)),
  http.get(BASE, ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'permission:system:read');
    if (denied) return denied;
    return HttpResponse.json(db.permissions, { status: 200 });
  }),

  // Create
  http.post('/permissions', async (ctx) => permissionsHandlers[3].resolver(ctx)),
  http.post(`${BASE}`, async ({ request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'permission:system:create');
    if (denied) return denied;
    const body = await request.json();
    const permission_id = nextId('permissions');
    const row = { ...body, permission_id };
    db.permissions.push(row);
    persistDb();
    return HttpResponse.json(row, { status: 201 });
  }),

  // Update
  http.put('/permissions/:id', async (ctx) => permissionsHandlers[5].resolver(ctx)),
  http.put(`${BASE}/:id`, async ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'permission:system:edit');
    if (denied) return denied;
    const id = Number(params.id);
    const body = await request.json();
    const idx = db.permissions.findIndex((p: any) => Number(p.permission_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.permissions[idx] = { ...db.permissions[idx], ...body, permission_id: id };
    persistDb();
    return HttpResponse.json(db.permissions[idx], { status: 200 });
  }),

  // Delete
  http.delete('/permissions/:id', (ctx) => permissionsHandlers[7].resolver(ctx)),
  http.delete(`${BASE}/:id`, ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'permission:system:delete');
    if (denied) return denied;
    const id = Number(params.id);
    const idx = db.permissions.findIndex((p: any) => Number(p.permission_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.permissions.splice(idx, 1);
    persistDb();
    return new HttpResponse(null, { status: 204 });
  }),
];
