# Guía OrangeAlex — Manejo de Errores en Frontend

Principios
- Normaliza los errores en servicios con `handleApiError` (lanza `AppError`).
- Mapea a mensajes de usuario con `mapAppErrorMessage`.
- Muestra notificaciones con `toast` (o `showToast*` helpers).
- Registra detalles técnicos con `errorService.logError(normalizeError(...))`.

Piezas clave
- `src/shared/api/errorService.ts`: `handleApiError`, `normalizeError`, cola y adapter.
- `src/shared/utils/errorI18n.ts`: `mapAppErrorMessage(err)` → mensaje i18n.
- `src/constants/errorMessages.ts`: catálogo base de errores.
- `src/shared/components/ErrorBoundary`: captura, avisa y permite reintentar.

Helpers
- `showToast*` (ver `src/shared/utils/showToast.ts`): centraliza toasts.
- `useSafeMutation` (ver `src/shared/hooks/useSafeMutation.ts`): envuelve TanStack Mutation con `onError` consistente.

Patrones de uso
1) Servicios (API)
```
try {
  const { data } = await api.get('/roles');
  return data;
} catch (error) {
  throw handleApiError(error);
}
```

2) Hooks (Query/Mutation)
```
const list = useQuery({
  queryKey: keys.all,
  queryFn: service.list,
  onError: (err) => showToastError(err, 'Error al cargar'),
});

const create = useSafeMutation(service.create, {
  onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
});
```

3) Formularios
```
try { await onSubmit(values); }
catch (err) { showToastError(err, 'Error al guardar'); }
```

Do’s & Don’ts
- Do: usar `handleApiError` en servicios y `mapAppErrorMessage`/`showToastError` en UI.
- Do: añadir `onError` en todas las queries/mutations.
- Don’t: usar `alert()` en producción.
- Don’t: mostrar mensajes crudos del backend si hay un status conocido.

Evolución sugerida
- Adoptar `useSafeMutation` gradualmente en nuevas mutaciones.
- Opcional: añadir `showToastWarning` si se requiere distinción visual.

Verificación (local)
- Ejecutar: `tsc --noEmit` (compilación TypeScript).
- Forzar fallos de red o 401/403/404/422 en endpoints para ver toasts.

Rutas de desarrollo útiles (solo DEV)
- Playground de mutaciones y errores: `/dev/mutation`
- Ejemplo CRUD con mutaciones seguras (Products): `/dev/products`
