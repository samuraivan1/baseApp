// Exponer utilidades de autenticación en window para pruebas en desarrollo.
import { useAuthStore } from '@/features/shell/state/authStore';

export function exposeAuth() {
  if (typeof window === 'undefined') return;
  const api = {
    getToken: () => useAuthStore.getState().getToken(),
    setToken: (t: string) => useAuthStore.getState().setToken(t),
    logout: () => useAuthStore.getState().logout(),
    // Helper para simular expiración (desencadena 401 en MSW)
    expire: () => useAuthStore.getState().setToken('mock-access-token-expired'),
  };
  (window as any).auth = api;
  // Mensaje breve en consola para descubrir la API
  // eslint-disable-next-line no-console
  console.info('[dev] auth helpers disponibles en window.auth (getToken, setToken, logout, expire)');
}

