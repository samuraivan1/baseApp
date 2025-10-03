import { http, HttpResponse } from 'msw';
import { db, nextId, persistDb } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';

export const relationsHandlers = [
  // user_roles
  // Legacy
  http.get('/user_roles', (ctx) => relationsHandlers[1].resolver(ctx)),
  http.get('/api/user_roles', ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'page:seguridad_roles:view');
    if (denied) return denied;
    return HttpResponse.json(db.user_roles, { status: 200 });
  }),
  http.post('/user_roles', async (ctx) => relationsHandlers[3].resolver(ctx)),
  http.post('/api/user_roles', async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'role:system:edit');
    if (denied) return denied;
    const body = await request.json();
    // Asignar id si aplica; si no, empujar directo (db.json podría no tener pk propio)
    const row = { ...body };
    db.user_roles.push(row);
    persistDb();
    return HttpResponse.json(row, { status: 201 });
  }),
  http.delete('/user_roles/:user_id/:role_id', (ctx) => relationsHandlers[5].resolver(ctx)),
  http.delete('/api/user_roles/:user_id/:role_id', ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'role:system:edit');
    if (denied) return denied;
    const user_id = Number(params.user_id);
    const role_id = Number(params.role_id);
    const idx = db.user_roles.findIndex((r: any) => Number(r.user_id) === user_id && Number(r.role_id) === role_id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.user_roles.splice(idx, 1);
    persistDb();
    return new HttpResponse(null, { status: 204 });
  }),

  // role_permissions
  http.get('/role_permissions', (ctx) => relationsHandlers[7].resolver(ctx)),
  http.get('/api/role_permissions', ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'page:seguridad_permisos:view');
    if (denied) return denied;
    return HttpResponse.json(db.role_permissions, { status: 200 });
  }),
  http.post('/role_permissions', async (ctx) => relationsHandlers[9].resolver(ctx)),
  http.post('/api/role_permissions', async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'permission:system:edit');
    if (denied) return denied;
    const body = await request.json();
    const row = { ...body };
    db.role_permissions.push(row);
    persistDb();
    return HttpResponse.json(row, { status: 201 });
  }),
  http.delete('/role_permissions/:role_id/:permission_id', (ctx) => relationsHandlers[11].resolver(ctx)),
  http.delete('/api/role_permissions/:role_id/:permission_id', ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'permission:system:edit');
    if (denied) return denied;
    const role_id = Number(params.role_id);
    const permission_id = Number(params.permission_id);
    const idx = db.role_permissions.findIndex((r: any) => Number(r.role_id) === role_id && Number(r.permission_id) === permission_id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.role_permissions.splice(idx, 1);
    persistDb();
    return new HttpResponse(null, { status: 204 });
  }),
];
