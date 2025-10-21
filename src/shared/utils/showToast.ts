import { toast, ToastOptions } from 'react-toastify';
import { mapAppErrorMessage } from '@/shared/utils/errorI18n';

export function showToastError(err: unknown, fallback?: string, opts?: ToastOptions) {
  const msg = mapAppErrorMessage(err) || fallback || 'Ocurrió un error.';
  toast.error(msg, opts);
}

export function showToastSuccess(message: string, opts?: ToastOptions) {
  toast.success(message, opts);
}

export function showToastInfo(message: string, opts?: ToastOptions) {
  toast.info(message, opts);
}

export const showToast = {
  success: showToastSuccess,
  error: showToastError,
  info: showToastInfo,
};
