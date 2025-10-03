import { http, HttpResponse } from 'msw';
import { db } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';

const BASE = '/api/permissions';

export const permissionsHandlers = [
  // Legacy
  http.get('/permissions', (ctx) => permissionsHandlers[1].resolver(ctx)),
  http.get(BASE, ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const denied = ensurePermission(auth.user.user_id, 'permission:system:read');
    if (denied) return denied;
    return HttpResponse.json(db.permissions, { status: 200 });
  }),
];
