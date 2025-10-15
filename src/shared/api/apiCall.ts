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
    return err<T, AppError>(normalized);
  }
}

