import React from 'react';
import { useSafeMutation } from '@/shared/hooks/useSafeMutation';
import { showToastSuccess } from '@/shared/utils/showToast';

export default function DevMutationPlayground() {
  const fail422 = useSafeMutation(async () => {
    // Simula 422 Validation Failed
    const res = await fetch('/api/dev/force-422', { method: 'POST' });
    if (!res.ok) throw { response: { status: 422, data: { message: 'Invalid payload' } } };
    return res.json();
  });

  const failNet = useSafeMutation(async () => {
    // Simula caída de red/host
    await fetch('http://127.0.0.1:5999/down');
  });

  const ok = useSafeMutation(async () => {
    showToastSuccess('Operación exitosa');
    return true;
  });

  const force401 = useSafeMutation(async () => {
    await fetch('/api/dev/force-401');
    throw { response: { status: 401 } };
  });
  const force403 = useSafeMutation(async () => {
    await fetch('/api/dev/force-403');
    throw { response: { status: 403 } };
  });
  const force404 = useSafeMutation(async () => {
    await fetch('/api/dev/force-404');
    throw { response: { status: 404 } };
  });

  return (
    <div style={{ padding: 24 }}>
      <h2>Playground de Mutaciones</h2>
      <p>Usa estos botones para probar el manejo de errores estandarizado.</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button onClick={() => fail422.mutate()}>Forzar 422</button>
        <button onClick={() => failNet.mutate()}>Forzar red caída</button>
        <button onClick={() => ok.mutate()}>Éxito</button>
        <button onClick={() => force401.mutate()}>Forzar 401</button>
        <button onClick={() => force403.mutate()}>Forzar 403</button>
        <button onClick={() => force404.mutate()}>Forzar 404</button>
      </div>
    </div>
  );
}
