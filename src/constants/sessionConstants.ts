/**
 * Constantes para las claves de sessionStorage y localStorage.
 */
export const SESSION_STORAGE_KEYS = {
  // Clave para el estado de autenticación de Zustand
  AUTH_STATE: 'auth',
  // Clave para el token CSRF
  CSRF_TOKEN: 'csrf_token',
  // Clave para marcar la sesión como revocada (logout)
  AUTH_REVOKED: 'auth:revoked',
  // Clave para el ID de usuario actual en los mocks
  MOCK_CURRENT_USER_ID: 'mock:current_user_id',
  // Clave para la base de datos en memoria de MSW
  MSW_DB: 'msw:db',
};