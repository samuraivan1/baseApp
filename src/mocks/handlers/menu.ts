import { http, HttpResponse, type HttpHandler } from 'msw';
import { db } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';

// Normaliza items al formato legacy que consume el front:
// { idMenu, titulo, ruta, permisoId, items }
type LegacyMenuItem = {
  id: number | string;
  parentId?: number | string | null;
  titulo?: string;
  label?: string;
  title?: string;
  name?: string;
  permisoId?: number;
  permissionId?: number;
  permission?: number | string;
  items?: LegacyMenuItem[];
  children?: LegacyMenuItem[];
  hijos?: LegacyMenuItem[];
  url?: string;
  path?: string;
  ruta?: string;
  idMenu?: number | string;
  menu_id?: number | string;
  key?: string;
};

function mapItemToLegacy(raw: LegacyMenuItem): LegacyMenuItem {
  const childrenRaw = raw.items || raw.children || raw.hijos || undefined;
  const mapped = {
    idMenu:
      raw.idMenu ??
      raw.menu_id ??
      raw.id ??
      raw.key ??
      String(raw.titulo ?? raw.title ?? raw.label ?? 'item'),
    titulo: raw.titulo ?? raw.title ?? raw.label ?? raw.name ?? '',
    ruta: raw.ruta ?? raw.path ?? raw.url ?? undefined,
    permisoId: raw.permisoId ?? raw.permissionId ?? raw.permission ?? undefined,
  } as LegacyMenuItem;
  if (Array.isArray(childrenRaw)) {
    mapped.items = childrenRaw.map(mapItemToLegacy);
  }
  return mapped;
}

const resolveMenus: HttpHandler['resolver'] = ({ request }) => {
  const auth = requireAuth(request);
  if (auth instanceof HttpResponse) return auth;
  const tree = ((db as unknown as Record<string, unknown>).menus ?? (db as unknown as Record<string, unknown>).menu ?? []) as LegacyMenuItem[];
  const mapped = tree.map(mapItemToLegacy);
  return HttpResponse.json(mapped, { status: 200 });
};

const resolveMenu: HttpHandler['resolver'] = ({ request }) => {
  const auth = requireAuth(request);
  if (auth instanceof HttpResponse) return auth;
  const tree = ((db as unknown as Record<string, unknown>).menu ?? (db as unknown as Record<string, unknown>).menus ?? []) as LegacyMenuItem[];
  const mapped = tree.map(mapItemToLegacy);
  return HttpResponse.json(mapped, { status: 200 });
};

const resolveMenuPerfil: HttpHandler['resolver'] = ({ request }) => {
  const auth = requireAuth(request);
  if (auth instanceof HttpResponse) return auth;
  const menu = ((db as unknown as Record<string, unknown>).menuPerfil ?? (db as unknown as Record<string, unknown>).menu ?? []) as LegacyMenuItem[];
  const mapAndFilter = (items: LegacyMenuItem[]): LegacyMenuItem[] =>
    items
      .map(mapItemToLegacy)
      .map((it) => ({
        ...it,
        items: Array.isArray(it.items) ? mapAndFilter(it.items) : undefined,
      }))
      .filter((it) => {
        const pid = (it.permisoId ?? it.permissionId) as number | undefined;
        if (pid != null && auth.user) {
          const denied = ensurePermission(auth.user.user_id, String(pid));
          if (denied) return false;
        }
        return !it.items || it.items.length > 0;
      });
  const filtered = mapAndFilter(menu);
  return HttpResponse.json(filtered, { status: 200 });
};

export const menuHandlers: HttpHandler[] = [
  // DEPRECATED: alias sin '/api' sólo por compatibilidad temporal
  http.get('/api/menus', resolveMenus),
  http.get('/menus', resolveMenus),
  http.get('/api/menu', resolveMenu),
  http.get('/menu', resolveMenu),
  // Perfil (filtrado por permiso por ítem si existe permissionId en la semilla)
  http.get('/api/menuPerfil', resolveMenuPerfil),
  http.get('/menuPerfil', resolveMenuPerfil),
];
