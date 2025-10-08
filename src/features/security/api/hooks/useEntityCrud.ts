import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeMutation } from '@/shared/hooks/useSafeMutation';
import { toast } from 'react-toastify';
import { mapAppErrorMessage } from '@/shared/utils/errorI18n';

type Id = number | string;

export type EntityService<T, C = Partial<T>> = {
  list: () => Promise<T[]>;
  create: (input: C) => Promise<T>;
  update: (id: Id, input: C) => Promise<T>;
  remove: (id: Id) => Promise<void>;
};

export function useEntityCrud<T, C = Partial<T>>(entityKey: string, service: EntityService<T, C>) {
  const qc = useQueryClient();
  const keys = {
    all: [entityKey] as const,
    detail: (id: Id) => [entityKey, id] as const,
  };
  const handleError = (err: unknown) => {
    toast.error(mapAppErrorMessage(err));
  };
  const list = useQuery<T[], Error>({
    queryKey: keys.all,
    queryFn: async () => {
      try {
        return await service.list();
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
  });

  const withErrorToast = <Args extends unknown[], Result>(
    fn: (...args: Args) => Promise<Result>
  ): ((...args: Args) => Promise<Result>) => {
    return async (...args: Args) => {
      try {
        return await fn(...args);
      } catch (err) {
        handleError(err);
        throw err;
      }
    };
  };

  const create = useMutation<T, Error, C>({
    mutationFn: withErrorToast((input: C) => service.create(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });

  const update = useMutation<T, Error, { id: Id; input: C }>({
    mutationFn: withErrorToast(({ id, input }: { id: Id; input: C }) => service.update(id, input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });

  const remove = useMutation<void, Error, Id>({
    mutationFn: withErrorToast((id: Id) => service.remove(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });

  // Mutaciones seguras opcionales: mismas firmas, con onError estándar integrado
  const createSafe = useSafeMutation<T, C, unknown>((input) => service.create(input), {
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
  const updateSafe = useSafeMutation<T, { id: Id; input: C }, unknown>(
    ({ id, input }) => service.update(id, input),
    { onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }) }
  );
  const removeSafe = useSafeMutation<void, Id, unknown>(
    (id) => service.remove(id),
    { onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }) }
  );

  return { keys, list, create, update, remove, createSafe, updateSafe, removeSafe };
}
