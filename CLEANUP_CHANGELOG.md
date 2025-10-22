chore(cleanup): Security - Lote 1 y 2

- Eliminados SCSS no importados en components (Permissions.scss, Roles.scss, RolePermissionsForm.scss)
- Podados módulos SCSS usados (.module.scss) y normalización de reglas
- Limpieza de imports no usados en RoleForm.tsx y RolePermissionsForm.tsx
- Removidas claves de query no usadas (rolePermissionsKeys)
- Eliminados helpers DTO no usados (permission.dto.ts, role.dto.ts)
- Removidos archivos de mensajes no usados (PermissionForm.messages.ts, components/common.messages.ts)

chore(unify-api): Auth + Security (Users/Roles/Permissions)

- Auth (Shell): refresh unificado vía servicio `authService.refresh(refresh_token?)` y consumidor `silentRefresh` actualizado
- Auth: eliminado import no usado de apiClient en silentRefresh
- Users: unificado update a PUT en servicio; eliminado handler PATCH en MSW
- Roles: eliminado handler PATCH en MSW; updates por PUT
- Permissions: updates por PUT en servicio (sin PATCH redundante)
