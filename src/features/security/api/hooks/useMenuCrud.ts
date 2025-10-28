import { useEntityCrud } from './useEntityCrud';
import type { EntityService } from './useEntityCrud';
import type { IMenu } from '@/features/security/types/models'; // Corrected import path
import { getMenus, createMenu, updateMenu, deleteMenu } from '../menuService';
import type { CreateMenuRequestDTO, UpdateMenuRequestDTO } from '@/features/security/types/dto'; // Corrected import path
import { useSafeMutation } from '@/shared/hooks/useSafeMutation';
import { useQueryClient } from '@tanstack/react-query';

// UI keeps domain `IMenu`; transport uses DTOs
type CreateInput = CreateMenuRequestDTO;
type UpdateInput = UpdateMenuRequestDTO;

export function useMenuCrud() {
  const qc = useQueryClient();
  const service: EntityService<IMenu, CreateInput> = {
    list: getMenus,
    create: (input: CreateInput) => createMenu(input),
    update: (id: number | string, input: CreateInput | UpdateInput) => updateMenu(Number(id), input as UpdateInput),
    remove: (id: number | string) => deleteMenu(Number(id)),
  };

  const crud = useEntityCrud<IMenu, CreateInput>('menus', service);

  const create = useSafeMutation<IMenu, CreateInput>(
    (input) => createMenu(input),
    { onSuccess: () => qc.invalidateQueries({ queryKey: ['menus'] }) }
  );
  const update = useSafeMutation<IMenu, { id: number; input: UpdateInput }>(
    ({ id, input }) => updateMenu(id, input),
    { onSuccess: () => qc.invalidateQueries({ queryKey: ['menus'] }) }
  );
  const remove = useSafeMutation<void, number>(
    (id) => deleteMenu(id),
    { onSuccess: () => qc.invalidateQueries({ queryKey: ['menus'] }) }
  );

  return { ...crud, create, update, remove };
}