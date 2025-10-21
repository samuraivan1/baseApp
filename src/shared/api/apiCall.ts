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
  } catch (e) {
    const normalized = normalizeError(e, { where: opts.where });
    errorService.logError(normalized);
    if (opts.toastOnError) {
      const msg = mapAppErrorMessage(normalized);
      toast.error(msg);
    }
    // Asegurar compatibilidad de tipos: mapear null a undefined en code
    const normFixed = { ...normalized, code: normalized.code ?? undefined } as const;
    return err<T, AppError>(normFixed as unknown as AppError);
  }
}
