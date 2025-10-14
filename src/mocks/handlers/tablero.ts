import { http, HttpResponse, type HttpHandler } from 'msw';
import { db, persistDb } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';

const getTablero: HttpHandler['resolver'] = ({ request }) => {
  const auth = requireAuth(request);
  if (auth instanceof HttpResponse) return auth;
  const denied = auth.user ? ensurePermission(auth.user.user_id, 'dashboard:read') : null;
  if (denied) return denied;
  return HttpResponse.json((db as Record<string, unknown>).tablero ?? {}, { status: 200 });
};

const updateTablero: HttpHandler['resolver'] = async ({ request }) => {
  const auth = requireAuth(request);
  if (auth instanceof HttpResponse) return auth;
  const denied = auth.user ? ensurePermission(auth.user.user_id, 'dashboard:write') : null;
  if (denied) return denied;
  const body = await request.json();
  (db as Record<string, unknown>).tablero = body as unknown as Record<string, unknown>;
  persistDb();
  return HttpResponse.json(body, { status: 200 });
};

export const tableroHandlers: HttpHandler[] = [
  // Legacy aliases sin '/api'
  http.get('/tablero', getTablero),
  http.get('/api/tablero', getTablero),
  http.put('/tablero', updateTablero),
  http.put('/api/tablero', updateTablero),
];
