// Unified apiCall that can optionally retry and throws AppError on failure
import { fromUnknown, withRetry, report } from '@/shared/errors/errorHandler';
/**
 * apiCall: Ejecuta una promesa con manejo de errores, reporte no bloqueante
 * y opción de reintento. Nunca convierte una operación exitosa en error
 * por fallas de telemetría o reporting.
 */
export async function apiCall<T>(
  fn: () => Promise<T>,
  opts?: { retry?: boolean; where?: string; toastOnError?: boolean }
): Promise<{ ok: true; value: T } | { ok: false; error: ReturnType<typeof fromUnknown> }> {
  try {
    const exec = async () => await fn();
    const value = opts?.retry ? await withRetry(exec) : await exec();
    return { ok: true as const, value };
  } catch (e) {
    const appErr = fromUnknown(e);
    // Reporte no bloqueante: si falla, no re-lanza
    try {
      await report(appErr, { where: opts?.where || 'apiCall' });
    } catch {
      // noop
    }
    return { ok: false as const, error: appErr };
  }
}
