import axios from 'axios';
import { errorMessages } from '@/constants/errorMessages';
import type { AppError } from '@/shared/api/errorService';

type MapOpts = { where?: string };

export function mapAppErrorMessage(err: unknown, opts: MapOpts = {}): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    if (status === 401) return errorMessages.unauthorized;
    if (status === 403) return errorMessages.forbidden;
    if (status === 404) return errorMessages.notFound;
    if (status === 422) return errorMessages.validation;
    if (status === 0) return errorMessages.network;
    const msg = (err.response?.data as { message?: string })?.message || err.message;
    return msg || errorMessages.unknown;
  }
  const app = err as Partial<AppError> | undefined;
  if (app?.code === 401) return errorMessages.unauthorized;
  if (app?.code === 403) return errorMessages.forbidden;
  if (app?.code === 404) return errorMessages.notFound;
  if (app?.code === 422) return errorMessages.validation;
  return (app?.message && String(app.message)) || errorMessages.unknown;
}
