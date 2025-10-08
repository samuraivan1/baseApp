import { useState } from 'react';
import { useProductsCrud } from '../api/hooks/useProductsCrud';
import { useQueryClient } from '@tanstack/react-query';
import type { Product } from '../api/productService';
import { showToastSuccess } from '@/shared/utils/showToast';

export default function ProductsPage() {
  const { list, create, update, remove } = useProductsCrud();
  const products = (list.data as Product[] | undefined) ?? [];
  const qc = useQueryClient();
  const [editing, setEditing] = useState<{ id?: number; name: string; price: number; description?: string | null } | null>(null);
  
  const startCreate = () => setEditing({ name: '', price: 0, description: '' });
  const startEdit = (p: Product) =>
    setEditing({ id: p.product_id, name: p.name, price: p.price, description: p.description ?? '' });
  const cancel = () => setEditing(null);

  const onSave = () => {
    if (!editing) return;
    if (editing.id != null) {
      update.mutate(
        { id: editing.id, input: { name: editing.name, price: Number(editing.price), description: editing.description ?? null } },
        { onSuccess: () => { showToastSuccess('Producto actualizado'); setEditing(null); } }
      );
    } else {
      create.mutate(
        { name: editing.name, price: Number(editing.price), description: editing.description ?? null },
        { onSuccess: () => { showToastSuccess('Producto creado'); setEditing(null); } }
      );
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Products</h2>
      {!editing && <button onClick={startCreate}>Nuevo</button>}
      {import.meta.env.DEV && !editing && (
        <button
          onClick={async () => {
            await fetch('/api/dev/products/reset', { method: 'POST' });
            await qc.invalidateQueries({ queryKey: ['products'] });
            showToastSuccess('Productos reseteados');
          }}
          style={{ marginLeft: 12 }}
        >
          Resetear productos (mock)
        </button>
      )}

      {editing && (
        <div style={{ marginBottom: 12 }}>
          <input placeholder="Nombre" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          <input placeholder="Precio" type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
          <input placeholder="Descripción" value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          <button onClick={onSave}>Guardar</button>
          <button onClick={cancel} style={{ marginLeft: 8 }}>Cancelar</button>
        </div>
      )}

      <table>
        <thead><tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Acciones</th></tr></thead>
        <tbody>
          {products.map((p: Product) => (
            <tr key={p.product_id}>
              <td>{p.product_id}</td><td>{p.name}</td><td>{p.price}</td>
              <td>
                <button onClick={() => startEdit(p)}>Editar</button>
                <button onClick={() => remove.mutate(p.product_id, { onSuccess: () => showToastSuccess('Producto eliminado') })} style={{ marginLeft: 8 }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
