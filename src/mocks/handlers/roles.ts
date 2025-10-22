import { http, HttpResponse } from 'msw';
import { db, nextId, persistDb } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';
import { requireCsrfOnMutation } from '../utils/csrf';
import { PERMISSIONS } from '@/features/security/constants/permissions';
import type { RoleResponseDTO, CreateRoleRequestDTO, UpdateRoleRequestDTO } from '@/features/security/types/dto';

function getRolesTable(): RoleResponseDTO[] {
  return db.roles as RoleResponseDTO[];
}

const BASE = '/api/roles';

export const rolesHandlers = [
  http.get(BASE, ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    if (!auth.user) return new HttpResponse(null, { status: 401 });
    const denied = auth.user ? ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_ROLES_VIEW
    ) : new HttpResponse(null, { status: 401 });
    if (denied) return denied;
    return HttpResponse.json(getRolesTable(), { status: 200 });
  }),

  http.get(`${BASE}/:id`, ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = auth.user ? ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_ROLES_VIEW
    ) : new HttpResponse(null, { status: 401 });
    if (denied) return denied;
    const id = Number(params.id);
    const row = getRolesTable().find((item) => Number(item.role_id) === id);
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
      PERMISSIONS.SECURITY_ROLES_CREATE
    ) : new HttpResponse(null, { status: 401 });
    if (denied) return denied;
    const body = (await request.json()) as CreateRoleRequestDTO;
    const role_id = nextId('roles');
    const row: RoleResponseDTO = {
      role_id,
      name: body.name ?? `Role ${role_id}`,
      description: body.description ?? '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    getRolesTable().push(row);
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
      PERMISSIONS.SECURITY_ROLES_UPDATE
    ) : new HttpResponse(null, { status: 401 });
    if (denied) return denied;
    const id = Number(params.id);
    const body = (await request.json()) as UpdateRoleRequestDTO;
    const roles = getRolesTable();
    const idx = roles.findIndex((item) => Number(item.role_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    roles[idx] = { ...roles[idx], ...body, role_id: id } as RoleResponseDTO;
    persistDb();
    return HttpResponse.json(roles[idx], { status: 200 });
  }),

  // Removed PATCH handler: updates unified via PUT

  http.delete(`${BASE}/:id`, ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = auth.user ? ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_ROLES_DELETE
    ) : new HttpResponse(null, { status: 401 });
    if (denied) return denied;
    const id = Number(params.id);
    const roles = getRolesTable();
    const idx = roles.findIndex((item) => Number(item.role_id) === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    roles.splice(idx, 1);
    persistDb();
    return new HttpResponse(null, { status: 204 });
  }),
];
