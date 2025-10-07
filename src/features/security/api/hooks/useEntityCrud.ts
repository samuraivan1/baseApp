import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

  const list = useQuery({ queryKey: keys.all, queryFn: service.list });

  const create = useMutation({
    mutationFn: (input: C) => service.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: Id; input: C }) => service.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });

  const remove = useMutation({
    mutationFn: (id: Id) => service.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });

  return { keys, list, create, update, remove };
}

