import { http, HttpResponse } from 'msw';
import { db, nextId, persistDb } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';
import { requireCsrfOnMutation } from '../utils/csrf';
import { PERMISSIONS } from '@/features/security/constants/permissions';
import type { UserResponseDTO, CreateUserRequestDTO, UpdateUserRequestDTO } from '@/features/security/types/dto';

function getUsersTable(): UserResponseDTO[] {
  return db.users as UserResponseDTO[];
}

const BASE = '/api/users';

export const usersHandlers = [
  http.get(BASE, ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = auth.user ? ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_USERS_VIEW
    ) : new HttpResponse(null, { status: 401 });
    if (denied) return denied;
    return HttpResponse.json(getUsersTable(), { status: 200 });
  }),

  http.get(`${BASE}/:id`, ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = auth.user ? ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_USERS_VIEW
    ) : new HttpResponse(null, { status: 401 });
    if (denied) return denied;
    const id = Number(params.id);
    const row = getUsersTable().find((u) => Number(u.user_id) === id);
    if (!row) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(row, { status: 200 });
  }),

  http.post(BASE, async ({ request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = auth.user ? ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_USERS_CREATE
    ) : new HttpResponse(null, { status: 401 });
    if (denied) return denied;
    const body = (await request.json()) as CreateUserRequestDTO;
    const user_id = nextId('users');
    const row: UserResponseDTO = {
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
    getUsersTable().push(row);
    persistDb();
    return HttpResponse.json(row, { status: 201 });
  }),

  http.put(`${BASE}/:id`, async ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = auth.user ? ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_USERS_UPDATE
    ) : new HttpResponse(null, { status: 401 });
    if (denied) return denied;
    const id = Number(params.id);
    const body = (await request.json()) as UpdateUserRequestDTO;
    const idx = getUsersTable().findIndex((u) => Number(u.user_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    const users = getUsersTable();
    const current = users[idx]!; // idx validated above
    users[idx] = {
      ...current,
      ...body,
      username: String((body.username ?? current.username) ?? ''),
      user_id: id,
    } as UserResponseDTO;
    persistDb();
    return HttpResponse.json(users[idx], { status: 200 });
  }),

  http.patch(`${BASE}/:id`, async ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
  const denied = auth.user ? ensurePermission(
    auth.user.user_id,
    PERMISSIONS.SECURITY_USERS_UPDATE
  ) : new HttpResponse(null, { status: 401 });
    if (denied) return denied;
    const id = Number(params.id);
    const body = (await request.json()) as UpdateUserRequestDTO;
    const idx = getUsersTable().findIndex((u) => Number(u.user_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    const users = getUsersTable();
    const current = users[idx]!; // idx validated above
    users[idx] = {
      ...current,
      ...body,
      username: String((body.username ?? current.username) ?? ''),
      user_id: id,
    } as UserResponseDTO;
    persistDb();
    return HttpResponse.json(users[idx], { status: 200 });
  }),

  http.delete(`${BASE}/:id`, ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = auth.user ? ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_USERS_DELETE
    ) : new HttpResponse(null, { status: 401 });
    if (denied) return denied;
    const id = Number(params.id);
    const idx = getUsersTable().findIndex((u) => Number(u.user_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    getUsersTable().splice(idx, 1);
    persistDb();
    return new HttpResponse(null, { status: 204 });
  }),
];
