import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import type { AppError } from '@/shared/api/errorService';
import { showToastError } from '@/shared/utils/showToast';

export function useSafeMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, AppError, TVariables>
): UseMutationResult<TData, AppError, TVariables> {
  return useMutation<TData, AppError, TVariables>({
    mutationFn,
    onError: (err, vars, ctx) => {
      showToastError(err);
      options?.onError?.(err, vars, ctx);
    },
    ...options,
  });
}

