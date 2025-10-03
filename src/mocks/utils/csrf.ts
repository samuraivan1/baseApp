import { HttpResponse } from 'msw';

function getCookie(request: Request, name: string): string | null {
  const raw = request.headers.get('cookie') || request.headers.get('Cookie') || '';
  const parts = raw.split(';').map((p) => p.trim());
  for (const p of parts) {
    const [k, v] = p.split('=');
    if (k === name) return decodeURIComponent(v || '');
  }
  return null;
}

export function requireCsrfOnMutation(request: Request): HttpResponse | null {
  const method = (request.method || 'GET').toUpperCase();
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return null;
  const header = request.headers.get('x-csrf-token') || request.headers.get('X-CSRF-Token');
  const cookie = getCookie(request, 'csrf_token');
  // En dev aceptamos el token mock aunque la cookie aún no esté escrita por el SW
  const devBypass = header === 'mock-csrf-token';
  if (!header || (!cookie && !devBypass) || (cookie && header !== cookie)) {
    return HttpResponse.json({ message: 'CSRF token missing/invalid' }, { status: 403 });
  }
  return null;
}
