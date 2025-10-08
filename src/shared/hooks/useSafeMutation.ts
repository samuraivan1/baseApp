import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query';
import type { AppError } from '@/shared/api/errorService';
import { showToastError } from '@/shared/utils/showToast';

export function useSafeMutation<TData, TVariables = void, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, AppError, TVariables, TContext>
): UseMutationResult<TData, AppError, TVariables, TContext> {
  const { onError, ...restOptions } = options ?? {};
  return useMutation<TData, AppError, TVariables, TContext>({
    ...restOptions,
    mutationFn,
    onError: (err, vars, onMutateResult, mutationCtx) => {
      showToastError(err);
      onError?.(err, vars, onMutateResult, mutationCtx);
    },
  });
}
