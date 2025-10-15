import { apiCall } from '@/shared/api/apiCall';

type WithApiCallOpts<T> = {
  where?: string;
  toastOnError?: boolean;
  onOk?: (value: T) => void | Promise<void>;
};

export async function withApiCall<T>(action: () => Promise<T>, opts: WithApiCallOpts<T> = {}) {
  const res = await apiCall(action, { where: opts.where, toastOnError: opts.toastOnError ?? true });
  if (res.ok) await opts.onOk?.(res.value);
  return res;
}

