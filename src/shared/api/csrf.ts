// Utilidad mínima para leer el token CSRF desde cookie legible por JS
// El backend debe emitir la cookie `csrf_token` con `Secure; SameSite=Lax|Strict`.

// removed unused getCookie helper (was not referenced)

import { SESSION_STORAGE_KEYS } from '@/constants/sessionConstants';

export function getCsrfToken(): string | null {
  try {
    return window.localStorage.getItem(SESSION_STORAGE_KEYS.CSRF_TOKEN);
  } catch {
    return null;
  }
}

export function setCsrfToken(token: string): void {
  try {
    window.localStorage.setItem(SESSION_STORAGE_KEYS.CSRF_TOKEN, token);
  } catch {
    // ignore
  }
}
