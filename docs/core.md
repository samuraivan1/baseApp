CoreModule (infraestructura compartida)

Objetivo
- Centralizar providers y utilidades transversales para que apps/microfrontends compartan configuración.

Ubicación
- `src/core/index.ts`: reexports de ErrorBoundary, apiClient/getBaseURL, queryClient y Providers.
- `src/core/providers.tsx`: `CoreProviders` combina ReduxProvider, QueryClientProvider, ErrorBoundary y Devtools.

Uso sugerido
import { CoreProviders } from '@/core';
import { store } from '@/app/store';

<CoreProviders store={store}>
  <App />
</CoreProviders>

Notas
- apiClient y queryClient siguen en sus ubicaciones actuales; `core` los reexporta para ergonomía.
- Puedes agregar ThemeProvider/NotificationProvider en `CoreProviders` cuando estés listo.

ThemeProvider y Notifications
- `ThemeProvider` (mínimo) expone un contexto con tokens base (ej.: `primary: var(--color-primary)`).
- Hook `useTheme()` para acceder a tokens en JS si necesitas lógica condicional.
- `ToastContainer` está incluido por defecto (react-toastify). Para disparar notificaciones:

```ts
import { toast } from 'react-toastify';

toast.success('Operación exitosa');
toast.error('Algo salió mal');
```

Personalización
- Ajusta posición/duración de `ToastContainer` en `CoreProviders`.
- Extiende `ThemeProvider` para inyectar un objeto de tokens temáticos o leer de CSS variables.

Ejemplo Microfrontend (componente aislado)
```tsx
import { CoreProviders } from '@/core';
import { store } from '@/app/store';

export function MicrofrontendRoot() {
  return (
    <CoreProviders store={store}>
      <SomeIsolatedWidget />
    </CoreProviders>
  );
}
```

Uso de useTheme en un componente
```tsx
import { useTheme } from '@/core';

export function ThemedBadge() {
  const theme = useTheme();
  return <span style={{ color: theme.primary }}>Badge</span>;
}
```
