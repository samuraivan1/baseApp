import { http, HttpResponse } from 'msw';
import { db } from '../data/db';
import { requireAuth } from '../utils/auth';
import { SESSION_STORAGE_KEYS } from '@/constants/sessionConstants';

type LoginBody = { username?: string; email?: string; password: string };

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginBody;
    const { username, email } = body;
    const user = db.users.find((u: { username?: string; email?: string }) =>
      username ? u.username === username : email ? u.email === email : false
    );
    if (!user) {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    const access_token = `mock-access-token:${user.user_id}`;
    const refresh_token = 'mock-refresh-token';
    const session = {
      user,
      access_token,
      refresh_token,
      expires_in: 3600,
      csrf_token: 'mock-csrf-token',
    };
    try { if (typeof window !== 'undefined' && 'localStorage' in window) localStorage.setItem('mock:current_user_id', String(user.user_id)); } catch {
      // ignore
    }
    return HttpResponse.json(session, {
      status: 200,
      headers: {
        // CSRF token legible por JS
        'Set-Cookie': `csrf_token=${encodeURIComponent('mock-csrf-token')}; Path=/; SameSite=Lax`,
      },
    });
  }),

  http.post('/api/auth/refresh', async () => {
    let uid: string | null = null;
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        uid =
          localStorage.getItem(SESSION_STORAGE_KEYS.MOCK_CURRENT_USER_ID) ??
          localStorage.getItem('mock:current_user_id'); // compat legado
      }
    } catch {
      // ignore
    }
    const userId = uid ? Number(uid) : NaN;
    const user = db.users.find((u) => Number(u.user_id) === userId);
    if (!user) {
      return new HttpResponse(null, { status: 401 });
    }
    const access_token = `mock-access-token:${user.user_id}`;
    const refresh_token = 'mock-refresh-token';
    return HttpResponse.json(
      { access_token, refresh_token, expires_in: 3600, csrf_token: 'mock-csrf-token', user },
      {
        status: 200,
        headers: {
          'Set-Cookie': `csrf_token=${encodeURIComponent('mock-csrf-token')}; Path=/; SameSite=Lax`,
        },
      }
    );
  }),

  http.post('/api/auth/logout', async () => {
    try { if (typeof window !== 'undefined' && 'localStorage' in window) localStorage.removeItem('mock:current_user_id'); } catch {
      // ignore
    }
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
    if (!auth.user) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json({ user: auth.user }, { status: 200 });
  }),
];
