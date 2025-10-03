import { http, HttpResponse } from 'msw';
import { db, persistDb } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';

export const tableroHandlers = [
  // Legacy
  http.get('/tablero', (ctx) => tableroHandlers[1].resolver(ctx)),
  http.get('/api/tablero', ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'dashboard:read');
    if (denied) return denied;
    return HttpResponse.json((db as any).tablero ?? {}, { status: 200 });
  }),
  http.put('/tablero', async (ctx) => tableroHandlers[3].resolver(ctx)),
  http.put('/api/tablero', async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'dashboard:write');
    if (denied) return denied;
    const body = await request.json();
    (db as any).tablero = body;
    persistDb();
    return HttpResponse.json(body, { status: 200 });
  }),
];
