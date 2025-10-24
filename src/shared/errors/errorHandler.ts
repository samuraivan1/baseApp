import { AppError, type ErrorContext } from './AppError';
import { resolveCatalog } from './errorCatalog';
import telemetry from '@/shared/observability/telemetry';
import { getCurrentTraceId } from '@/shared/observability/trace';

function extractAxios(err: unknown): {
  isAxios: boolean;
  status?: number;
  data?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  message?: string;
} {
  const e = err as { isAxiosError?: boolean; response?: { status?: number; data?: any; headers?: any }; message?: string };
  const isAxios = Boolean(e?.response || e?.isAxiosError);
  return {
    isAxios,
    status: e?.response?.status,
    data: (e?.response?.data as Record<string, unknown>) || undefined,
    headers: (e?.response?.headers as Record<string, unknown>) || undefined,
    message: e?.message,
  };
}

function mapStatusToCode(status?: number): string {
  if (status === 401) return 'AUTH_401';
  if (status === 403) return 'SEC_403';
  if (status === 404) return 'NOT_FOUND_404';
  if (status === 422) return 'VAL_422';
  if (status && status >= 500) return 'API_5XX';
  return 'UNKNOWN';
}

export function fromUnknown(err: unknown): AppError {
  const traceId = getCurrentTraceId() || undefined;
  const axios = extractAxios(err);
  if (axios.isAxios) {
    const code = mapStatusToCode(axios.status);
    const cat = resolveCatalog(code);
    const payloadMsg = typeof axios.data?.message === 'string' ? (axios.data.message as string) : undefined;
    const headerTrace = typeof axios.headers?.['x-trace-id'] === 'string' ? (axios.headers['x-trace-id'] as string) : undefined;
    const payloadTrace = typeof axios.data?.traceId === 'string' ? (axios.data.traceId as string) : undefined;
    return new AppError({
      message: payloadMsg || axios.message || cat.defaultMessage,
      code: code,
      statusCode: axios.status ?? null,
      retryable: cat.retryable,
      traceId: headerTrace || payloadTrace || traceId,
      details: axios.data,
    });
  }

  // Network-like or generic errors
  const message = (err as { message?: string })?.message || 'Unexpected error';
  const code = message?.toLowerCase().includes('timeout') ? 'NET_TIMEOUT' : 'NET_0';
  const cat = resolveCatalog(code);
  return new AppError({
    message: message || cat.defaultMessage,
    code,
    statusCode: null,
    retryable: cat.retryable,
    traceId,
    details: err,
  });
}

export async function report(err: AppError, extra?: ErrorContext) {
  await telemetry.captureException(
    {
      message: err.message,
      code: err.code,
      status: err.statusCode,
      traceId: err.traceId,
      details: err.details,
    },
    { ...extra, where: extra?.where || 'errorHandler.report' }
  );
}

export async function withRetry<T>(fn: () => Promise<T>, opts?: { attempts?: number; baseMs?: number }): Promise<T> {
  const attempts = Math.max(1, opts?.attempts ?? 2);
  const base = Math.max(50, opts?.baseMs ?? 200);
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      const appErr = fromUnknown(e);
      if (!appErr.retryable || i === attempts - 1) throw appErr;
      const backoff = base * Math.pow(2, i);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
  throw fromUnknown(lastError);
}
