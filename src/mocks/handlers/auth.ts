import { http, HttpResponse } from 'msw';
import { db, persistDb } from '../data/db';
import { requireAuth } from '../utils/auth';

type LoginBody = { username?: string; email?: string; password: string };

export const authHandlers = [
// DEPRECATED: Aliases without /api prefix kept for temporary legacy compatibility
  http.post('/auth/login', async (ctx) => authHandlers[1].resolver(ctx)),
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginBody;
    const { username, email } = body;
    const user = db.users.find((u: any) =>
      username ? u.username === username : email ? u.email === email : false
    );
    if (!user) {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    const access_token = 'mock-access-token';
    const refresh_token = 'mock-refresh-token';
    const session = {
      user,
      access_token,
      refresh_token,
      expires_in: 3600,
      csrf_token: 'mock-csrf-token',
    };
    return HttpResponse.json(session, {
      status: 200,
      headers: {
        // CSRF token legible por JS
        'Set-Cookie': `csrf_token=${encodeURIComponent('mock-csrf-token')}; Path=/; SameSite=Lax`,
      },
    });
  }),

  http.post('/auth/refresh', async (ctx) => authHandlers[3].resolver(ctx)),
  http.post('/api/auth/refresh', async () => {
    const access_token = 'mock-access-token-refreshed';
    const refresh_token = 'mock-refresh-token';
    return HttpResponse.json(
      { access_token, refresh_token, expires_in: 3600, csrf_token: 'mock-csrf-token' },
      {
        status: 200,
        headers: {
          // Re‑emite CSRF token en cada refresh para garantizar disponibilidad
          'Set-Cookie': `csrf_token=${encodeURIComponent('mock-csrf-token')}; Path=/; SameSite=Lax`,
        },
      }
    );
  }),

  http.post('/auth/logout', async (ctx) => authHandlers[5].resolver(ctx)),
  http.post('/api/auth/logout', async () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        // Expira CSRF token en logout
        'Set-Cookie': 'csrf_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax',
      },
    });
  }),

  // Sesión actual a partir del Authorization (Bearer) o token mock
  http.get('/api/auth/session', ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    return HttpResponse.json({ user: auth.user }, { status: 200 });
  }),
];
