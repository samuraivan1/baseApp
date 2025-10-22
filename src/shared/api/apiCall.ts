import { Result, ok, err } from './result';
import errorService, { normalizeError, type AppError } from '@/shared/api/errorService';
import { mapAppErrorMessage } from '@/shared/utils/errorI18n';
import { toast } from 'react-toastify';

type ApiCallOpts = {
  where?: string;
  toastOnError?: boolean;
};

export async function apiCall<T>(fn: () => Promise<T>, opts: ApiCallOpts = {}): Promise<Result<T, AppError>> {
  try {
    const data = await fn();
    return ok<T, AppError>(data);
  } catch (e: unknown) {
    // Si el servicio ya lanzó AppError, úsalo; si no, normaliza a NormalizedError y luego adapta a AppError
    const isAppError = (val: unknown): val is AppError =>
      !!val && typeof val === 'object' && typeof (val as { message?: unknown }).message === 'string' && typeof (val as { timestamp?: unknown }).timestamp === 'string';

    const normalized = isAppError(e) ? e : normalizeError(e, { where: opts.where });
    // errorService.logError espera NormalizedError; si recibimos AppError, lo convertimos a NormalizedError compatible
    const toLog = isAppError(normalized)
      ? { message: normalized.message, code: typeof normalized.code === 'string' ? normalized.code : normalized.code?.toString() ?? undefined, timestamp: normalized.timestamp, context: { where: opts.where } }
      : normalized;
    // Log con tipo compatible con NormalizedError del errorService
    errorService.logError(toLog as {
      message: string;
      code?: string | null;
      timestamp: string;
      context?: Record<string, unknown>;
      status?: number | null;
      details?: unknown;
    });
    if (opts.toastOnError) {
      const appErr: AppError = isAppError(normalized)
        ? normalized
        : { message: normalized.message, code: normalized.code ?? undefined, timestamp: normalized.timestamp };
      const msg = mapAppErrorMessage(appErr);
      toast.error(msg);
    }
    const appError: AppError = isAppError(normalized)
      ? normalized
      : { message: normalized.message, code: normalized.code ?? undefined, timestamp: normalized.timestamp };
    return err<T, AppError>(appError);
  }
}
