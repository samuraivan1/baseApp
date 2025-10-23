title: "Seguridad, RBAC y Permisos"
version: 1.0
status: active
last_sync: 2025-10-23
🔒 9. Seguridad, RBAC y Permisos
El sistema implementa un Control de Acceso Basado en Roles (RBAC) tipado y centralizado.

9.1 Formato de permisos
dominio.recurso.accion

Ejemplo:

security.users.view

security.roles.update

9.2 Fuente única
src/features/security/constants/permissions.ts
Ejemplo:

ts

export const PERMISSIONS = {
SECURITY_USERS_VIEW: "security.users.view",
SECURITY_USERS_CREATE: "security.users.create",
};
9.3 Uso en rutas
tsx

<Route
path="/usuarios"
element={
<ProtectedRoute permiso={PERMISSIONS.SECURITY_USERS_VIEW}>
<UsersPage />
</ProtectedRoute>
}
/>
9.4 Uso en UI
tsx

const canEdit = useAuthStore((s) =>
s.hasPermission(PERMISSIONS.SECURITY_USERS_UPDATE)
);
{canEdit && <Button>Editar</Button>}
9.5 Roles mock de desarrollo
Definidos en src/mocks/data/db.ts:

Admin: todos los permisos (\*).

Editor: lectura + edición.

Viewer: solo vista.

9.6 Flujo de autenticación
Login → recibe JWT y roles.

silentRefresh → renueva sesión.

useAuthStore → mantiene user y permissions.

ProtectedRoute → bloquea acceso si no cumple permiso.

---

---
