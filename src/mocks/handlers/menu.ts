import { http, HttpResponse } from 'msw';
import { db, nextId, persistDb } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';
import { requireCsrfOnMutation } from '../utils/csrf';
import { PERMISSIONS } from '@/features/security/constants/permissions';
import type { MenuResponseDTO, CreateMenuRequestDTO, UpdateMenuRequestDTO } from '@/features/security/types/dto';

function getMenusTable(): MenuResponseDTO[] {
  return db.menu as MenuResponseDTO[];
}

// Helper to transform CreateMenuRequestDTO to MenuResponseDTO, assigning IDs for nested items
function transformCreateToResponse(item: CreateMenuRequestDTO): MenuResponseDTO {
  const idMenu = nextId('menu');
  return {
    idMenu,
    titulo: item.titulo,
    iconKey: item.iconKey,
    ruta: item.ruta,
    permisoId: item.permisoId ?? null,
    permission_string: item.permission_string ?? null,
    items: item.items ? item.items.map(transformCreateToResponse) : null,
    kind: item.kind ?? null,
  };
}

const BASE = '/api/menus';

export const menuHandlers = [
  http.get(BASE, ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    if (!auth.user) return new HttpResponse(null, { status: 401 });
    const denied = ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_MENU_VIEW
    );
    if (denied) return denied;
    return HttpResponse.json(getMenusTable(), { status: 200 });
  }),

  http.get(`${BASE}/:id`, ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    if (!auth.user) return new HttpResponse(null, { status: 401 });
    const denied = ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_MENU_VIEW
    );
    if (denied) return denied;
    const id = Number(params.id);
    const row = getMenusTable().find(
      (item) => Number(item.idMenu) === id
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
      PERMISSIONS.SECURITY_MENU_CREATE
    );
    if (denied) return denied;
    const body = (await request.json()) as CreateMenuRequestDTO;
    const newMenu = transformCreateToResponse(body); // Use helper to create new menu with IDs

    getMenusTable().push(newMenu);
    persistDb();
    return HttpResponse.json(newMenu, { status: 201 });
  }),

  http.put(`${BASE}/:id`, async ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    if (!auth.user) return new HttpResponse(null, { status: 401 });
    const denied = ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_MENU_UPDATE
    );
    if (denied) return denied;
    const id = Number(params.id);
    const body = (await request.json()) as UpdateMenuRequestDTO;
    const menus = getMenusTable();
    const idx = menus.findIndex(
      (item) => Number(item.idMenu) === id
    );
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    menus[idx] = {
      ...menus[idx],
      ...body,
      idMenu: id,
    } as MenuResponseDTO;
    persistDb();
    return HttpResponse.json(menus[idx], { status: 200 });
  }),

  http.delete(`${BASE}/:id`, ({ params, request }) => {
    const csrf = requireCsrfOnMutation(request);
    if (csrf) return csrf;
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    if (!auth.user) return new HttpResponse(null, { status: 401 });
    const denied = ensurePermission(
      auth.user.user_id,
      PERMISSIONS.SECURITY_MENU_DELETE
    );
    if (denied) return denied;
    const id = Number(params.id);
    const menus = getMenusTable();
    const idx = menus.findIndex(
      (item) => Number(item.idMenu) === id
    );
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    menus.splice(idx, 1);
    persistDb();
    return new HttpResponse(null, { status: 204 });
  }),
];
