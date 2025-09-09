import { useAuthStore } from '@/store/authStore';

/**
 * Un hook personalizado para verificar si el usuario actual tiene un permiso específico.
 * @param {string} requiredPermission - El string del permiso a verificar (ej. 'create:task').
 * @returns {boolean} - Devuelve true si el usuario tiene el permiso, de lo contrario false.
 */
export const usePermission = (requiredPermission: string): boolean => {
  // Abstrae la llamada directa a la función hasPermission del store.
  const hasPermission = useAuthStore((state) => state.hasPermission);

  // Devuelve directamente el resultado booleano.
  return hasPermission(requiredPermission);
};
