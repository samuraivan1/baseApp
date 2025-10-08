import { http, HttpResponse } from 'msw';
import { db, nextId, persistDb } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';
import { requireCsrfOnMutation } from '../utils/csrf';
import { PERMISSIONS } from '@/features/security/constants/permissions';
import type { User } from '@/features/security/types';

const BASE = '/api/users';

export const usersHandlers = [
  
  http.get(BASE, ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, PERMISSIONS.SECURITY_USERS_VIEW);
    if (denied) return denied;
    return HttpResponse.json(db.users, { status: 200 });
  }),

  http.get(`${BASE}/:id`, ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, PERMISSIONS.SECURITY_USERS_VIEW);
    if (denied) return denied;
    const id = Number(params.id);
    const row = db.users.find((u: any) => Number(u.user_id) === id);
    if (!row) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(row, { status: 200 });
  }),

  http.post(BASE, async ({ request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, PERMISSIONS.SECURITY_USERS_CREATE);
    if (denied) return denied;
    const body = (await request.json()) as Partial<User>;
    const user_id = nextId('users');
    const row: User = {
      user_id,
      username: body.username ?? `user${user_id}`,
      password_hash: 'mock_hash',
      first_name: body.first_name ?? 'New',
      last_name_p: body.last_name_p ?? 'User',
      email: body.email ?? `user${user_id}@example.com`,
      is_active: body.is_active ?? 1,
      mfa_enabled: body.mfa_enabled ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.users.push(row as any);
    persistDb();
    return HttpResponse.json(row, { status: 201 });
  }),

  http.put(`${BASE}/:id`, async ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, PERMISSIONS.SECURITY_USERS_UPDATE);
    if (denied) return denied;
    const id = Number(params.id);
    const body = (await request.json()) as Partial<User>;
    const idx = db.users.findIndex((u: any) => Number(u.user_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.users[idx] = { ...db.users[idx], ...body, user_id: id } as any;
    persistDb();
    return HttpResponse.json(db.users[idx], { status: 200 });
  }),

  http.patch(`${BASE}/:id`, async ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, PERMISSIONS.SECURITY_USERS_UPDATE);
    if (denied) return denied;
    const id = Number(params.id);
    const body = (await request.json()) as Partial<User>;
    const idx = db.users.findIndex((u: any) => Number(u.user_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.users[idx] = { ...db.users[idx], ...body, user_id: id } as any;
    persistDb();
    return HttpResponse.json(db.users[idx], { status: 200 });
  }),

  http.delete(`${BASE}/:id`, ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, PERMISSIONS.SECURITY_USERS_DELETE);
    if (denied) return denied;
    const id = Number(params.id);
    const idx = db.users.findIndex((u: any) => Number(u.user_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.users.splice(idx, 1);
    persistDb();
    return new HttpResponse(null, { status: 204 });
  }),
];
