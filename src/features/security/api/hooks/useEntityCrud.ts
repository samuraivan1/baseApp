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

  const list = useQuery({
    queryKey: keys.all,
    queryFn: service.list,
    onError: (err) => toast.error(mapAppErrorMessage(err)),
  });

  const create = useMutation({
    mutationFn: (input: C) => service.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
    onError: (err) => toast.error(mapAppErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: Id; input: C }) => service.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
    onError: (err) => toast.error(mapAppErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: (id: Id) => service.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
    onError: (err) => toast.error(mapAppErrorMessage(err)),
  });

  // Mutaciones seguras opcionales: mismas firmas, con onError estándar integrado
  const createSafe = useSafeMutation<T, C>(
    (input) => service.create(input),
    { onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }) }
  );
  const updateSafe = useSafeMutation<T, { id: Id; input: C }>(
    ({ id, input }) => service.update(id, input),
    { onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }) }
  );
  const removeSafe = useSafeMutation<void, Id>(
    (id) => service.remove(id),
    { onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }) }
  );

  return { keys, list, create, update, remove, createSafe, updateSafe, removeSafe };
}
