---
status: archived
reason: "Movido desde raíz a /docs/01_Estandares/"
---
<!-- Contenido original del manifesto a continuación -->

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
