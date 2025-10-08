# Estándar de Permisos y Control de Acceso (RBAC)

Este documento define el estándar para la gestión de permisos en la aplicación, basado en un sistema de Control de Acceso Basado en Roles (RBAC).

## 1. Formato de Permisos: `dominio.recurso.accion`

Todos los permisos del sistema deben seguir una nomenclatura estricta de tres partes, separadas por puntos:

`dominio.recurso.accion`

- **Dominio (`domain`):** Representa una sección principal o característica de la aplicación. Corresponde a un *feature* en la arquitectura.
  - Ejemplos: `security`, `kanban`, `home`.

- **Recurso (`resource`):** Es una entidad, página o componente específico dentro de un dominio.
  - Ejemplos: `users`, `roles`, `board`, `tasks`.

- **Acción (`action`):** Define la operación que se puede realizar sobre el recurso. Se basa en las operaciones CRUD y otras acciones específicas.
  - Acciones estándar: `view`, `create`, `update`, `delete`.
  - Acciones personalizadas: `move`, `assign`, `submit`.

**Ejemplo:** El permiso `security.users.update` permite al usuario `actualizar` (`update`) la información de `usuarios` (`users`) dentro del dominio de `seguridad` (`security`).

## 2. Fuente Única de la Verdad

La definición canónica de todos los permisos disponibles en el sistema se encuentra en un único archivo:

**`src/features/security/constants/permissions.ts`**

Este archivo exporta un objeto `PERMISSIONS` que debe ser utilizado en toda la aplicación para verificar permisos. Esto garantiza consistencia y previene errores tipográficos.

```typescript
// Ejemplo de uso
import { PERMISSIONS } from '@/features/security/constants/permissions';

// En un componente de ruta
<ProtectedRoute permiso={PERMISSIONS.SECURITY_USERS_VIEW} />

// En un componente de UI
<PermissionGate perm={PERMISSIONS.SECURITY_USERS_CREATE}>
  <Button>Crear Usuario</Button>
</PermissionGate>
```

No se deben usar strings de permisos "mágicos" o literales en ningún lugar del código.

## 3. Política de Roles por Defecto (Mock Data)

El entorno de desarrollo (`mocks`) utiliza un conjunto de roles predefinidos con una política de asignación de permisos clara, gestionada en `src/mocks/data/db.ts`:

- **Administrador (`Admin`):**
  - **Política:** Acceso total.
  - **Permisos:** Recibe **todos** los permisos definidos en el sistema.

- **Editor:**
  - **Política:** Puede ver todo y editar la mayoría de los recursos.
  - **Permisos:** Recibe todos los permisos que terminan en `*.view` y `*.update`.

- **Visor (`Viewer`):**
  - **Política:** Solo lectura.
  - **Permisos:** Recibe únicamente los permisos que terminan en `*.view`.

Estas asignaciones se realizan dinámicamente al iniciar el mock server, asegurando que los roles reflejen el estado actual de los permisos en `db.json`.

## 4. Uso en el Frontend

### Protección de Rutas

Las rutas se protegen usando el componente `ProtectedRoute`, que requiere un permiso específico para renderizar su contenido.

```tsx
// src/routes/AppRoutes.tsx
<Route
  path="/seguridad/usuarios"
  element={
    <ProtectedRoute permiso={PERMISSIONS.SECURITY_USERS_VIEW}>
      <UsersPage />
    </ProtectedRoute>
  }
/>
```

### Protección de Componentes y UI

Para mostrar u ocultar elementos de la interfaz de usuario (como botones o menús) según los permisos del usuario, se utiliza el componente `PermissionGate`.

```tsx
### Protección de Componentes y UI

Para mostrar u ocultar elementos de la interfaz de usuario (como botones o menús) según los permisos del usuario, se utiliza el componente `PermissionGate`.

```tsx
// Ejemplo en un componente de página
import PermissionGate from '@/shared/components/common/PermissionGate';
import { useAuthStore } from '@/features/shell/state/authStore';

// ...

<PermissionGate perm={PERMISSIONS.SECURITY_USERS_CREATE}>
  <Button onClick={handleCreate}>Añadir Usuario</Button>
</PermissionGate>

// O usando el hook de Zustand directamente para lógica condicional
const canUpdate = useAuthStore.getState().hasPermission(PERMISSIONS.SECURITY_USERS_UPDATE);
if (canUpdate) {
  // ... lógica para actualizar
}
```

## 5. Verificación de Permisos

La verificación de permisos se centraliza a través del store de autenticación de Zustand (`useAuthStore`).

- **`useAuthStore.getState().hasPermission(permission: string): boolean`**: Verifica si el usuario actual tiene un permiso específico.
- **`useAuthStore.getState().hasAllPermissions(permissions: string[]): boolean`**: Verifica si el usuario tiene **todos** los permisos de una lista.
- **`useAuthStore.getState().hasAnyPermission(permissions: string[]): boolean`**: Verifica si el usuario tiene **alguno** de los permisos de una lista.

Estos métodos son la forma autorizada de realizar comprobaciones de permisos en la lógica de los componentes.

```

## 5. Flujo de Autenticación y Permisos

1.  **Login:** El usuario se autentica.
2.  **Sesión:** El backend (o el mock server) devuelve el perfil del usuario, incluyendo sus roles.
3.  **Cálculo de Permisos:** El `AuthProvider` en el frontend recibe los roles y solicita al backend la lista consolidada de `permission_string` para dichos roles.
4.  **Contexto de Autenticación:** El hook `useAuth` expone la lista de permisos del usuario y la función `hasPermissions` para realizar validaciones en toda la aplicación.
5.  **Persistencia:** La sesión y los permisos se mantienen en el estado de la aplicación y se actualizan silenciosamente para que el usuario no pierda el acceso al recargar la página (F5).

