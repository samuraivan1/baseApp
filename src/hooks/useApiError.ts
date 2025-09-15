// src/hooks/useApiError.ts
import { useCallback } from 'react';
import errorService, { normalizeError } from '@/services/errorService';
// Asumiendo que tienes un tipo para la respuesta del error, si no, lo definimos
type HandledError = {
  title: string;
  message: string;
};

export function useApiError() {
  // ✅ Usamos 'unknown' en lugar de 'any' para mayor seguridad de tipos
  const handleError = useCallback(
    (err: unknown, context?: unknown): HandledError => {
      const normalized = normalizeError(err, context);

      errorService.logError(normalized);

      if (normalized.status === 401)
        return {
          title: 'No autorizado',
          message: 'Tu sesión expiró, por favor inicia sesión.',
        };
      if (normalized.status === 403)
        return {
          title: 'Acceso denegado',
          message: 'No tienes permisos para realizar esta acción.',
        };
      if (normalized.status === 400)
        return {
          title: 'Solicitud inválida',
          message: normalized.message || 'Revisa los datos.',
        };

      // ✅ CORRECCIÓN: Primero comprueba que 'status' existe, y luego compara.
      if (normalized.status && normalized.status >= 500)
        return {
          title: 'Error del servidor',
          message: 'Ocurrió un problema, inténtalo más tarde.',
        };

      return {
        title: 'Error',
        message: normalized.message || 'Ocurrió un error inesperado.',
      };
    },
    []
  );

  return { handleError };
}
