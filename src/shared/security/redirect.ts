import { APP_ROUTES } from '@/constants/routes';

const ALLOWED_ROUTES = new Set<string>([
  APP_ROUTES.HOME,
  APP_ROUTES.KANBAN,
  APP_ROUTES.FORMS_DEMO,
  APP_ROUTES.SECURITY,
  APP_ROUTES.SECURITY_USERS,
  APP_ROUTES.SECURITY_ROLES,
  APP_ROUTES.SECURITY_PERMISSIONS,
]);

export function ensureSafeInternalPath(input: unknown, fallback: string = APP_ROUTES.HOME): string {
  const path = typeof input === 'string' ? input : '';
  if (!path) return fallback;
  // Solo rutas internas absolutas, sin esquema ni doble slash inicial
  if (!path.startsWith('/') || path.startsWith('//')) return fallback;
  // No permitir segmentos peligrosos
  if (path.includes('://')) return fallback;
  // Whitelist explícita de rutas conocidas; si no coincide, regresar a Home
  if (ALLOWED_ROUTES.has(path)) return path;
  // Permitir subrutas de seguridad cuando vengan anidadas correctamente
  if (path.startsWith(APP_ROUTES.SECURITY + '/')) return path;
  return fallback;
}
