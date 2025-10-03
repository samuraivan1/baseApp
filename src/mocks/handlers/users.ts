import { http, HttpResponse } from 'msw';
import { db, nextId, persistDb } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';

const BASE = '/api/users';

export const usersHandlers = [
  // Legacy aliases without /api
  http.get('/users', (ctx) => usersHandlers[1].resolver(ctx)),
  http.get(BASE, ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'user:system:read');
    if (denied) return denied;
    return HttpResponse.json(db.users, { status: 200 });
  }),

  http.get('/users/:id', (ctx) => usersHandlers[3].resolver(ctx)),
  http.get(`${BASE}/:id`, ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'user:system:read');
    if (denied) return denied;
    const id = Number(params.id);
    const row = db.users.find((u: any) => Number(u.user_id) === id);
    if (!row) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(row, { status: 200 });
  }),

  http.post('/users', async (ctx) => usersHandlers[5].resolver(ctx)),
  http.post(BASE, async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'user:system:create');
    if (denied) return denied;
    const body = await request.json();
    const user_id = nextId('users');
    const row = { ...body, user_id };
    db.users.push(row);
    persistDb();
    return HttpResponse.json(row, { status: 201 });
  }),

  http.put('/users/:id', async (ctx) => usersHandlers[7].resolver(ctx)),
  http.put(`${BASE}/:id`, async ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'user:system:edit');
    if (denied) return denied;
    const id = Number(params.id);
    const body = await request.json();
    const idx = db.users.findIndex((u: any) => Number(u.user_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.users[idx] = { ...db.users[idx], ...body, user_id: id };
    persistDb();
    return HttpResponse.json(db.users[idx], { status: 200 });
  }),

  http.patch('/users/:id', async (ctx) => usersHandlers[9].resolver(ctx)),
  http.patch(`${BASE}/:id`, async ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'user:system:edit');
    if (denied) return denied;
    const id = Number(params.id);
    const body = await request.json();
    const idx = db.users.findIndex((u: any) => Number(u.user_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.users[idx] = { ...db.users[idx], ...body, user_id: id };
    persistDb();
    return HttpResponse.json(db.users[idx], { status: 200 });
  }),

  http.delete('/users/:id', (ctx) => usersHandlers[11].resolver(ctx)),
  http.delete(`${BASE}/:id`, ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'user:system:delete');
    if (denied) return denied;
    const id = Number(params.id);
    const idx = db.users.findIndex((u: any) => Number(u.user_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.users.splice(idx, 1);
    persistDb();
    return new HttpResponse(null, { status: 204 });
  }),
];
