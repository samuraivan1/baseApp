# Manifiesto de Arquitectura del Proyecto baseApp

Este documento es la fuente de verdad sobre los estándares de arquitectura, tecnologías y mejores prácticas del proyecto **baseApp**.  
Su cumplimiento es obligatorio para garantizar la calidad, escalabilidad y mantenibilidad del código.

---

## 1. Stack Tecnológico Principal

- **Framework:** React 18+ con TypeScript.
- **Bundler y Entorno:** Vite.
- **Gestión de Estado:**
  - **Servidor:** TanStack Query (React Query v5).
  - **Cliente Global:** Zustand (patrón de slices).
- **Estilos:** SCSS modular + BEM + sistema de diseño global.
- **Enrutamiento:** React Router v6.
- **Formularios:** React Hook Form + Zod.
- **Calidad:** ESLint + Prettier (con hooks y commitlint).
- **Pruebas:** Vitest + React Testing Library.
- **Mock API:** Mock Service Worker (MSW).
- **Documentación de Componentes:** Storybook.

---

## 2. Arquitectura: Feature-Sliced Design (FSD)

El código se organiza por funcionalidades de negocio, no por tipos técnicos.  
Estructura general:

```
src/
├── app/           → Providers, inicialización global, rutas
├── features/      → Módulos funcionales (auth, security, kanban…)
├── components/    → UI Kit (ui, common, form)
├── constants/     → Permisos, rutas, queryKeys
├── store/         → Zustand slices globales
├── styles/        → Base SCSS, mixins, variables
└── types/         → Tipos TypeScript compartidos
```

Cada feature debe ser autocontenida: su lógica de API, hooks, componentes y tipos deben vivir juntos.

---

## 2.1 Fuentes de Verdad (SoT)

- Rutas de la app: `src/constants/routes.ts` (`APP_ROUTES`).
- Permisos RBAC: `src/features/security/constants/permissions.ts` (`PERMISSIONS`).
- Mock DB / RBAC de desarrollo: `src/mocks/data/db.ts`.
- Tipos centralizados por feature en `src/features/<feature>/types/`:
  - `models.ts` (modelos de dominio)
  - `dto.ts` (DTOs: Create/Update separados del modelo)
  - `relations.ts` (tablas pivote)
  - `schemas*.ts` (Zod para contratos y validación)
  - Export público: `index.ts` (no duplicar DTOs fuera de este paquete)

Toda verificación de permisos y rutas debe depender de estas constantes.

---

## 3. Gestión de Estado

### 3.1 Estado del Servidor (TanStack Query)

- Toda data que provenga del backend debe manejarse con React Query.
- Hooks ubicados dentro de cada feature (`features/security/hooks`).
- No se deben almacenar datos de API en Zustand o `useState`.

### 3.2 Estado Global del Cliente (Zustand)

- Exclusivo para estado de UI o sesión.
- Uso del patrón **slice por dominio**.
- `src/store` combina slices (`authSlice`, `menuSlice`, etc.).

---

## 4. Estilos y Sistema de Diseño global

- Paleta corporativa: **#F26822 (naranja Truper)** + grises neutros.
- Inputs compactos (~36px).
- BEM + SCSS modular: `bloque__elemento--modificador`.
- Variables en `src/styles/_variables.scss` y exportadas en `:root`.

Ejemplo:

```scss
:root {
  --color-primary: #f26822;
  --color-bg: #ffffff;
  --radius-md: 6px;
}
```

---

## 5. Enrutamiento y Seguridad

### 5.1 Estándar de Permisos y Control de Acceso (RBAC)

El proyecto implementa un sistema de **Control de Acceso Basado en Roles (RBAC)**.

#### Formato de Permisos: `dominio.recurso.accion`

Todos los permisos deben seguir el formato `dominio.recurso.accion`:

- **Dominio:** corresponde a un feature (ej. `security`, `kanban`).
- **Recurso:** entidad o componente (ej. `users`, `roles`).
- **Acción:** operación CRUD (`view`, `create`, `update`, `delete`) o personalizada (`assign`, `move`).

**Ejemplo:** `security.users.update` permite editar usuarios del dominio seguridad.

#### Fuente Única de Verdad

El archivo **`src/features/security/constants/permissions.ts`** exporta el objeto `PERMISSIONS`.  
Este es el único punto de referencia válido para verificar permisos.

```typescript
import { PERMISSIONS } from '@/features/security/constants/permissions';

<ProtectedRoute permiso={PERMISSIONS.SECURITY_USERS_VIEW}>
  <UsersPage />
</ProtectedRoute>

// También puedes usar el componente `PermissionGate` (shared) para gateo de UI.
```

No se deben usar strings literales en el código. Centralización: `src/features/security/constants/permissions.ts`.

#### Política de Roles (Mock Data)

En el entorno de desarrollo (`src/mocks/data/db.ts`):

- **Administrador:** acceso total (`*`).
- **Editor:** puede ver y editar (`*.view`, `*.update`).
- **Visor:** solo lectura (`*.view`).

#### Uso en el Frontend

**Protección de Rutas:**

```tsx
<Route
  path="/seguridad/usuarios"
  element={
    <ProtectedRoute permiso={PERMISSIONS.SECURITY_USERS_VIEW}>
      <UsersPage />
    </ProtectedRoute>
  }
/>
```

**Protección de UI:**

Si no existe `PermissionGate`, aplicar una verificación con el store:

```tsx
const canCreate = useAuthStore((s) =>
  s.hasPermission(PERMISSIONS.SECURITY_USERS_CREATE)
);
{
  canCreate && <Button onClick={handleCreate}>Añadir Usuario</Button>;
}
```

**Verificación de Permisos (Zustand):**

```typescript
useAuthStore.getState().hasPermission("security.users.create");
useAuthStore
  .getState()
  .hasAllPermissions(["security.users.view", "security.users.update"]);
useAuthStore
  .getState()
  .hasAnyPermission(["security.users.view", "security.users.delete"]);
```

#### Flujo de Autenticación y Permisos

1. **Login:** El usuario se autentica.
2. **Sesión:** El backend (o mock) devuelve roles.
3. **Permisos:** El frontend calcula los `permission_string`.
4. **Contexto:** `useAuthStore` expone `hasPermission`.
5. **Persistencia:** Mantiene permisos activos tras recargar (`F5`).

---

## 6. Formularios

- Formularios nuevos deben usar **React Hook Form + Zod**.
- Validaciones tipadas con `zodResolver`.
- Esquemas documentados en `types/` o dentro de la feature.
- Estándar de integración: usar `Controller`/`useController` de RHF para conectar los componentes de formulario del sistema (`FormInput`, `FormTextarea`, `FormSelect`, etc.). Evitar `watch + setValue` como mecanismo principal de control; puede usarse solo para normalizaciones puntuales.
- Accesibilidad: propagar `aria-invalid` y `aria-describedby` hacia los inputs, asociando los mensajes de error del schema.
- Envío: declarar `onSubmit` en el `<form>` con `handleSubmit(onValid)` para habilitar envío por teclado.

---

## 7. Componentes UI y Reutilización

- **Storybook obligatorio** para componentes de `ui`.
- Los `common` deben documentarse cuando se usan globalmente.
- global define la base visual y de espaciado.
- Cada componente debe tener su propio archivo SCSS y no depender de herencias globales.

---

## 8. Mocking y API

- MSW simula endpoints (`src/mocks/handlers`).
- Base de datos simulada: `src/mocks/data/db.json`.
- Contratos críticos: login, refresh, roles, users, permissions.

---

## 9. Sin `any` y Tipado Estricto

- Prohibido el uso de `any`, `unknown` o `//@ts-ignore`.
- Usar genéricos (`<T extends object>`).
- Tipado de props y retorno obligatorio.

---

## 10. Mensajes Centralizados

- Todo texto visible debe residir en `*.messages.ts`.
- Ejemplo: `Roles.messages.ts`, `Users.messages.ts`.

---

## 11. Componentes Base Estándar

- **CommandBar / SearchBar:** Controla búsqueda, filtros y acciones.
- **DynamicFilter:** Filtros opcionales (cliente o servidor).
- **EntityTable:** Tabla estándar con ordenamiento, scroll y export a Excel.
- **Pagination:** Fija, no parte del scroll, estilo global.

---

## 12. Accesibilidad (A11y)

- Todos los inputs deben tener `label` o `aria-label`.
- Formularios con roles ARIA (`role="form"`, `aria-required`).
- Soporte completo de teclado.
- Evitar feedback visual basado solo en color.

---

## 13. Versionado y CI/CD

- Commits tipo **Conventional Commits** (`feat:`, `fix:`, `docs:`…).
- Linter, TypeScript y tests deben pasar antes de merge.
- Versionado **SemVer (x.y.z)**.
- PRs con descripción funcional y capturas de UI cuando aplique.

---

## 14. TypeScript y ESLint

- `"strict": true` en `tsconfig.json`.
- Regla sin `any`.
- ESLint debe validar:
  - Orden de imports (`import/order`).
  - Dependencias de hooks (`react-hooks/exhaustive-deps`).
  - Nombrado y consistencia.

---

## 15. Pruebas (Testing)

- **Unitarias:** funciones en `utils`.
- **Integración:** hooks (`useRoles`, `useUsers`).
- **Snapshot:** componentes de `ui`.
- Cobertura mínima: 70% líneas, 80% funciones críticas.

---

## 16. Performance

- Lazy loading (`React.lazy`, `Suspense`).
- `useMemo`, `useCallback`, `React.memo` en listas.
- Code splitting por ruta.
- Perfilado con `React.Profiler` durante desarrollo.

---

## 17. Estándares y Reglas Adicionales

### 17.1 Fronteras entre Módulos

- Ningún feature puede importar internamente otro feature.
- Comunicación vía Zustand, eventos o `index.ts` públicos.
- Enforced by ESLint (`import/no-restricted-paths`).

### 17.2 Patrón de Slices en Zustand

- Cada feature define su propio slice (`src/features/auth/slice.ts`).
- El store principal (`src/store`) los combina.

### 17.3 Convención de Nombres TanStack Query

- `useRoles`, `useUsers` → listas.
- `useRole(id)` → entidad.
- `useRoleMutations` → agrupa create/update/delete.

### 17.4 Uso de DTOs

- Crear DTOs cuando payload ≠ respuesta API.
- Ejemplo: `src/features/security/api/user.dto.ts`.

### 17.5 Componentes Compuestos

- Agrupar patrones repetidos (ej. `PaginatedEntityTable`).
- Documentar en Storybook.

### 17.6 Design Tokens

- Definidos en `_variables.scss` y expuestos en `:root`.
- Ejemplo: `--color-primary`, `--spacing-md`, `--radius-md`.

---

## 18. Accesibilidad y Rendimiento Adicional

- Mantener alto contraste de texto en todos los componentes.
- Paginación visible siempre (fuera del scroll).
- Soporte completo de tema claro/oscuro (futuro).
- Reducir repaint y reflow en tablas extensas.

---

## 19. Prácticas de Colaboración

- Branches por feature (`feature/roles-crud`).
- Commits pequeños y descriptivos.
- Code reviews obligatorios.
- Documentación mínima por PR.

---

## 20. Conclusión

El proyecto **baseApp** representa un estándar de arquitectura empresarial:

- Modular, escalable, accesible y fuertemente tipado.
- Visualmente consistente bajo el **global Design System**.
- Con flujos de desarrollo estandarizados y auditables por IA.

**Este manifiesto es vinculante.**  
Toda contribución debe alinearse a estos lineamientos para mantener la calidad, coherencia y sustentabilidad del sistema.

##Adidiconal
TypeScript
No usar any. Si no hay tipo, definir interfaces mínimas o usar genéricos con Record<string, unknown>.
No bloques vacíos. En catch o bloques vacíos, añade un comentario // ignore o // no-op.
Evita casts de DTOs. Usa los mappers toCreateUserDto / toUpdateUserDto en lugar de castear.
No exportar/usar tipos de auth desde rutas ambiguas; usar siempre `features/security/types` y `I*`.
React
No importar React por defecto en componentes con JSX moderno. Solo importa lo que uses (useState, useEffect, etc.).
SectionHeader: no usar la prop right. Si se necesita botón secundario, renderizarlo fuera del header.
FormActions: onAccept siempre debe ser una función. Si no corresponde aceptar, pasar onAccept={() => {}} y manejar readOnly/permiso a nivel de formulario.
Hooks: no llamar hooks condicionalmente. Mover la lógica de retorno o condicional fuera del orden de hooks.
API/Cliente
apiClient: eliminar imports no usados (p. ej., AxiosRequestConfig). Usar interceptores ya definidos para auth y CSRF.
CSRF: manejar el token con getCsrfToken/setCsrfToken del módulo csrf. No leer cookies manualmente.
Seguridad y permisos
useEnsureAllPermsForUserRole: usar const isDev = import.meta.env.DEV para logs/toasts solo en desarrollo.
Al usar ensurePermission en handlers MSW, validar auth.user antes de llamar. Si no hay usuario, devolver 401.
Mocks (MSW)
No usar import msw/browser; usar import { setupWorker } from 'msw'.
Tipar adecuadamente tablas y datos. No @ts-expect-error en db; preferir tipos explícitos.
crudFactory: schema.partial() solo si schema es ZodObject. Evitar spreads de tipos no objeto, castear a object cuando corresponda.
roles/menu/tablero: agregar guardias de auth.user antes de verificar permisos.
Usuarios y formularios
Users/index.tsx:
Tipar UserWithRole como (User & { rolId?: number }) & Record<string, unknown>.
Normalizar is_active a boolean en la vista.
Evitar variables no usadas. Eliminar imports y estados no utilizados.
No castear objetos a CreateUserDto/UpdateUserDto; usar mappers.
UserForm.tsx:
Mantener defaultValues estáticos. Población dinámica vía reset/map.
logger.error(err as Error, { context: ... }).
No usar viewTitle ni right en SectionHeader. FormActions sin hideAccept.
Autenticación
authStore: mapear respuesta de login al shape que consume el store; no persistir refreshToken en frontend; limpiar localStorage con cuidado y marcar AUTH_REVOKED en logout.
silentRefresh: derivedPermissions deben mapear a Permission[] completos y tipados.
Rutas
AppRoutes: no importar React; usar Suspense y lazy.
Import hygiene
Eliminar imports sin uso inmediatamente. Mantener el linter en “error” para no-unused-vars.
Checklist de PRs

No hay any ni ts-expect-error.
No hay bloques vacíos sin comentario.
No hay imports sin uso (incluyendo React/AxiosRequestConfig).
FormActions tiene onAccept={() => {}} (nunca undefined).
SectionHeader no usa right.
No hay casts a DTOs; se usan mappers.
Handlers MSW validan auth.user antes de ensurePermission.
isDev se obtiene con import.meta.env.DEV.
silentRefresh mapea permisos a Permission[] completos.
Build y typecheck OK.
