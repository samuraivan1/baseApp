# Guía de Contribución (baseApp)

Este documento define normas prácticas para mantener el código consistente, seguro y fácil de mantener. Por favor, léelo antes de abrir PRs o realizar cambios significativos.

## Reglas de TypeScript y Linting

- Sin `any`.
  - Si el tipo no es evidente, define interfaces mínimas o usa genéricos con `Record<string, unknown>`.
  - Excepciones documentadas: en `src/mocks/data/db.ts` se emplean guards adicionales (función `isDev()`) para entornos de test donde `import.meta` o `window` podrían no existir; mantener tipado estricto y evitar `any` igualmente.
- Sin bloques vacíos.
  - En `catch` u otros bloques, agrega comentario `// ignore` o `// no-op` si no hay acción.
- Evitar `@ts-expect-error`.
  - Prefiere tipar o separar el código para reflejar la intención.
- Import hygiene.
  - Elimina imports no usados (incluido `React` en JSX moderno). No traigas tipos o símbolos redundantes.

## React y Componentes de UI

- Hooks
  - No llames hooks condicionalmente. Orden estable en cada render.
- `SectionHeader`
  - No usar prop `right`. Renderiza botones/acciones fuera del header.
- `FormActions`
  - `onAccept` siempre debe ser una función. Si no aplica aceptar (solo lectura), usar `onAccept={() => {}}` y controlar el estado a nivel de formulario.
  
  Control de UI por permisos (si no existe `PermissionGate`):
  
  ```tsx
  import { PERMISSIONS } from '@/features/security/constants/permissions';
  import { useAuthStore } from '@/features/shell/state/authStore';
  
  const canCreate = useAuthStore((s) => s.hasPermission(PERMISSIONS.SECURITY_USERS_CREATE));
  {canCreate && <Button onClick={onCreate}>Crear</Button>}
  ```
- Formularios
  - `defaultValues` estáticos. La carga dinámica se hace con `reset`/mappers.
  - `logger.error(err as Error, { context })` al capturar errores.

## API/Cliente y Seguridad

- `apiClient`
  - Evitar imports no usados como `AxiosRequestConfig`. Usa interceptores existentes para JWT/CSRF.
- CSRF
  - Usa `getCsrfToken`/`setCsrfToken` (JS storage). No leer cookies manualmente.
- Permisos
  - En MSW, valida `auth.user` antes de `ensurePermission`. Si no hay usuario, devolver 401.
- `useEnsureAllPermsForUserRole`
  - Usa `const isDev = import.meta.env.DEV` para toasts/logs solo en dev.
  - Nota: En mocks (`src/mocks/data/db.ts`) se usa un helper `isDev()` con guards por compatibilidad de tests; es una excepción válida en mocks.

## Mocks (MSW)

- Importar worker
  - Usa `import { setupWorker } from 'msw/browser'`.
- `crudFactory`
  - Aplica `schema.partial()` solo si `schema` es `ZodObject`.
  - Evita spreads de tipos no-objeto: castea a `object` cuando corresponda.
- Datos/DB
  - Tipar las tablas (roles, permissions, etc.). Evita `@ts-expect-error`.

## Seguridad: Usuarios y Formularios

- Lista de Usuarios (`Users/index.tsx`)
  - Tipo de fila: `(User & { rolId?: number }) & Record<string, unknown>`.
  - Normaliza `is_active` a `boolean` para la vista.
  - Evita variables no usadas y casts innecesarios.
- `UserForm.tsx`
  - No usar `right` ni `viewTitle` en `SectionHeader`.
  - `FormActions` sin `hideAccept`.

## Autenticación

- `authStore`
  - Mapear respuesta de login al shape del store; no persistir `refreshToken` en frontend.
  - Limpia `localStorage` con cuidado y marca `AUTH_REVOKED` en logout.
- `silentRefresh`
  - `derivedPermissions` deben mapear a `Permission[]` completos y tipados.

## Rutas

- `AppRoutes`
  - No importar `React`. Usa `Suspense` y `lazy`.

## DTOs y Mapeos

- Nunca castear a `CreateUserDto`/`UpdateUserDto` directamente.
  - Usa `toCreateUserDto` / `toUpdateUserDto`.
  - Los mappers deben omitir `password_hash` cuando sea `null`/`undefined`.

## Checklist para PRs

- [ ] No hay `any` ni `@ts-expect-error`.
- [ ] No hay bloques vacíos sin comentario.
- [ ] Sin imports no usados.
- [ ] `SectionHeader` sin `right`.
- [ ] `FormActions.onAccept` es función (no `undefined`).
- [ ] Sin casts a DTOs; se usan mappers.
- [ ] Handlers MSW validan `auth.user` antes de `ensurePermission`.
- [ ] `isDev` desde `import.meta.env.DEV`.
- [ ] `silentRefresh` mapea permisos completos.
- [ ] Build y typecheck pasan localmente.

## Prompt sugerido para PRs

Copia-pega en la descripción del PR:

> Validar antes de merge:
> - No se usa `any` ni `@ts-expect-error`.
> - No hay bloques vacíos; si existen, tienen comentario `// ignore` o `// no-op`.
> - Se eliminaron imports no usados (incl. `React` en JSX).
> - `SectionHeader` no usa `right`. `FormActions.onAccept` siempre es función.
> - No se castea a DTOs; se usan `toCreateUserDto`/`toUpdateUserDto` y omiten `password_hash` nulo.
> - En MSW, todas las rutas con permisos validan `auth.user` antes de `ensurePermission`.
> - `isDev` viene de `import.meta.env.DEV`.
> - `silentRefresh` mapea `Permission[]` completos.
> - Build y typecheck OK.
