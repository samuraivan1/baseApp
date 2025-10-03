// Utilidad mínima para leer el token CSRF desde cookie legible por JS
// El backend debe emitir la cookie `csrf_token` con `Secure; SameSite=Lax|Strict`.

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getCsrfToken(): string {
  const cookie = getCookie('csrf_token');
  if (cookie) return cookie;
  try {
    const backup = window.localStorage.getItem('csrf_token');
    return backup || '';
  } catch {
    return '';
  }
}
