import { HttpResponse } from 'msw';
import { db } from '../data/db';

export function getBearer(req: Request): string | null {
  const auth = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!auth) return null;
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

export type AuthedUser = { user: any; token: string };

export function requireAuth(req: Request): AuthedUser | HttpResponse {
  const token = getBearer(req);
  if (!token) return new HttpResponse(null, { status: 401 });
  // Simular expiración: si el token contiene 'expired', responder 401
  if (token.toLowerCase().includes('expired')) {
    return new HttpResponse(null, { status: 401 });
  }
  // En mock, resolvemos usuario por token fijo o por primer usuario si hay sesión mock.
  // Alternativa: mapear token->user en localStorage, pero aquí usamos primer usuario válido.
  // Intentar extraer user_id codificado en token (mock-access-token[:id])
  let user: any | undefined;
  const parts = token.split(':');
  if (parts.length > 1) {
    const id = Number(parts[1]);
    const byId = db.users.find((u: any) => Number(u.user_id) === id);
    if (byId) user = byId;
  }
  if (!user) return new HttpResponse(null, { status: 401 });
  return { user, token };
}

export function hasPermission(userId: number, permString: string): boolean {
  // Bypass total para usuario 1 (Super Admin)
  if (Number(userId) === 1) return true;
  const roleIds = db.user_roles
    .filter((ur: any) => Number(ur.user_id) === Number(userId))
    .map((ur: any) => Number(ur.role_id));
  if (!roleIds.length) return false;
  const permIds = new Set(
    db.role_permissions
      .filter((rp: any) => roleIds.includes(Number(rp.role_id)))
      .map((rp: any) => Number(rp.permission_id))
  );
  const assignedPermStrings = new Set(
    db.permissions
      .filter((p: any) => permIds.has(Number(p.permission_id)))
      .map((p: any) => String(p.permission_string))
  );
  return assignedPermStrings.has(permString);
}

export function ensurePermission(userId: number, permId: string): HttpResponse | null {
  if (!hasPermission(userId, permId)) {
    return HttpResponse.json({ message: 'Forbidden', permission: permId }, { status: 403 });
  }
  return null;
}

export function ensureAnyPermission(userId: number, permIds: string[]): HttpResponse | null {
  for (const p of permIds) {
    if (hasPermission(userId, p)) return null;
  }
  return HttpResponse.json({ message: 'Forbidden', anyOf: permIds }, { status: 403 });
}
