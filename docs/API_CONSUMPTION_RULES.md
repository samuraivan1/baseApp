# Reglas y Lineamientos para Consumo de APIs

Este documento define el estándar obligatorio para consumir APIs desde el frontend. Aplica a todo el código del repositorio y está diseñado para facilitar el reemplazo posterior por una API Spring Boot sin cambios en la UI.

## Principios
- Cliente HTTP único y centralizado.
- Separación estricta de capas: Servicios (datos) vs UI/Hooks (presentación).
- Manejo de errores consistente y tipado sin `any`.
- Mocking consistente con MSW bajo prefijo `/api`.

## Cliente HTTP
- Usar solo `src/shared/api/apiClient.ts` (Axios):
  - Base URL: `/api` (o tomada de `configService`).
  - `withCredentials: true` para cookies/CSRF.
  - Interceptores: Authorization Bearer, X-CSRF-Token y refresh automático en 401.
- Prohibido usar `fetch` o `axios` directamente en componentes o hooks de UI.

## Servicios (Capa de Datos)
- Todas las llamadas HTTP deben vivir en archivos `*/api/*Service.ts`.
- Reglas:
  - Envolver cada request en `try/catch` y `throw handleApiError(error)`.
  - Convertir DTO → dominio en el servicio (mappers `mapXFromDto`).
  - No exponer Axios Response al exterior; retornar datos tipados del dominio.
  - Nombres claros: `getX`, `createX`, `updateX`, `deleteX`.
- Ejemplo:
  ```ts
  import api from '@/shared/api/apiClient';
  import { handleApiError } from '@/shared/api/errorService';
  import { mapUserFromDto, type UserResponseDTO } from './dto';

  export async function getUsers() {
    try {
      const { data } = await api.get<UserResponseDTO[]>('/users');
      return data.map(mapUserFromDto);
    } catch (e) {
      throw handleApiError(e);
    }
  }
  ```

## UI y Hooks
- No consumir HTTP directo (ni `apiClient`, ni `fetch`, ni `axios`).
- Envolver el uso de servicios con `apiCall(() => service.fn(), { where, toastOnError })` para:
  - Normalizar y registrar errores en `errorService`.
  - Mostrar toasts de error internacionalizados cuando aplique.
- Para mutaciones, preferir `useSafeMutation` o `useMutation` con el servicio envuelto en `apiCall`.

## Errores y Logging
- Servicios: lanzan `AppError` mediante `handleApiError`.
- `apiCall` es idempotente respecto a `AppError` y produce `Result<T, AppError>`.
- `errorService` centraliza envío/cola con adapter (Sentry/console).
- No usar `any`: tipado estricto en errores y datos.

## Configuración de Entorno
- Usar `configService` para cargar configuración al inicio:
  - `loadConfig()` intenta `/api/config` y hace fallback a `/config.json` y variables.
  - Consumir valores con `getConfig()`; no leer `import.meta.env` desde componentes.

## MSW (Mocks)
- Todos los handlers bajo `/api`.
- Evitar alias duplicados sin prefijo.
- Endpoint de configuración habilitado: `GET /api/config`.

## Autenticación y Seguridad
- `apiClient` añade automáticamente `Authorization: Bearer` y `X-CSRF-Token` cuando corresponde.
- El refresh 401 es automático y transparente; no reimplementar en servicios.
- Para acciones sensibles, usar confirmaciones en UI y envolver en `apiCall`.

## Estructura de Carpetas
- `src/shared/api` → cliente, servicios compartidos, errores, config.
- `src/features/**/api` → servicios por feature + DTOs/mappers.
- `src/mocks/handlers` → MSW handlers por dominio.

## Antipatrones Prohibidos
- `fetch`/`axios`/`apiClient` en componentes o hooks de UI.
- Manejar errores parcialmente en UI (dejar a `apiCall` y servicios).
- Retornar `AxiosResponse` desde servicios.
- Usar `any` o tipos implícitos.

## Checklist de PR
- [ ] ¿Todas las llamadas HTTP están en servicios `*/api/*Service.ts`?
- [ ] ¿Cada servicio usa `try/catch` + `handleApiError`?
- [ ] ¿La UI usa `apiCall`/`useSafeMutation` y no invoca HTTP directo?
- [ ] ¿Se mapean DTO → dominio en los servicios?
- [ ] ¿Sin `any` ni tipos implícitos?
- [ ] ¿Handlers MSW bajo `/api` y sin duplicados?

## Ejemplo de Uso en Hook
```ts
import { useQuery } from '@tanstack/react-query';
import { apiCall } from '@/shared/api/apiCall';
import { getUsers } from '@/features/security/api/userService';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await apiCall(getUsers, { where: 'users.list', toastOnError: true });
      if (!res.ok) throw res.error; // React Query maneja el error
      return res.value;
    },
  });
}
```

## Migración a Spring Boot
- Mantén contratos en servicios; al cambiar el backend, adapta rutas/DTOs dentro del servicio sin tocar UI.
- Usa MSW para simular nuevos endpoints antes de tener el backend listo.

