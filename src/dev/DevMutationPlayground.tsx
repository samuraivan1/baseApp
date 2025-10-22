import { useSafeMutation } from '@/shared/hooks/useSafeMutation';
import { showToastSuccess, showToast } from '@/shared/utils/showToast';
import { force401, force403, force404, force422, backendDown } from '@/dev/api/devService';

export default function DevMutationPlayground() {
  const fail422 = useSafeMutation(async () => force422());

  const failNet = useSafeMutation(async () => backendDown());

  const ok = useSafeMutation(async () => {
    // Ambas formas válidas; mantenemos named export y objeto
    showToastSuccess('Operación exitosa');
    showToast.success('Operación exitosa');
    return true;
  });

  const force401Mut = useSafeMutation(async () => force401());
  const force403Mut = useSafeMutation(async () => force403());
  const force404Mut = useSafeMutation(async () => force404());

  return (
    <div style={{ padding: 24 }}>
      <h2>Playground de Mutaciones</h2>
      <p>Usa estos botones para probar el manejo de errores estandarizado.</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button onClick={() => fail422.mutate(undefined)}>Forzar 422</button>
        <button onClick={() => failNet.mutate(undefined)}>Forzar red caída</button>
        <button onClick={() => ok.mutate(undefined)}>Éxito</button>
        <button onClick={() => force401Mut.mutate(undefined)}>Forzar 401</button>
        <button onClick={() => force403Mut.mutate(undefined)}>Forzar 403</button>
        <button onClick={() => force404Mut.mutate(undefined)}>Forzar 404</button>
      </div>
    </div>
  );
}
