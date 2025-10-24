import { fromUnknown, withRetry } from '@/shared/errors/errorHandler';

export async function apiCallEx<T>(fn: () => Promise<T>, opts?: { retry?: boolean }): Promise<T> {
  try {
    if (opts?.retry) {
      return await withRetry(fn);
    }
    return await fn();
  } catch (e) {
    throw fromUnknown(e);
  }
}

