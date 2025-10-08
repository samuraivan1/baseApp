import { useEntityCrud, type EntityService } from '@/features/security/api/hooks/useEntityCrud';
import { useSafeMutation } from '@/shared/hooks/useSafeMutation';
import { useQueryClient } from '@tanstack/react-query';
import type { Product, ProductInput } from '../productService';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../productService';

export function useProductsCrud() {
  const service: EntityService<Product, ProductInput> = {
    list: getProducts,
    create: createProduct,
    update: (id, input) => updateProduct(Number(id), input),
    remove: (id) => deleteProduct(Number(id)),
  };
  const crud = useEntityCrud<Product, ProductInput>('products', service);
  const qc = useQueryClient();

  const create = useSafeMutation<Product, ProductInput, unknown>(createProduct, {
    onSuccess: () => qc.invalidateQueries({ queryKey: crud.keys.all }),
  });
  const update = useSafeMutation<Product, { id: number; input: ProductInput }, unknown>(
    ({ id, input }) => updateProduct(Number(id), input),
    { onSuccess: () => qc.invalidateQueries({ queryKey: crud.keys.all }) }
  );
  const remove = useSafeMutation<void, number, unknown>(
    (id) => deleteProduct(Number(id)),
    { onSuccess: () => qc.invalidateQueries({ queryKey: crud.keys.all }) }
  );

  return { ...crud, create, update, remove };
}
