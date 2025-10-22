# Plan de Corrección (Borrador, requiere aprobación)

## Orden por lotes
- shared/api (bajo riesgo)
- shared/components (medio)
- features/security (medio)
- features/shell (medio)
- features/kanban (medio)
- features/auth (medio)
- mocks/dev (bajo)

## Acciones por archivo (resumen)
- Remover exports no usados (según auditoría)
- Eliminar wrappers/puentes redundantes
- Eliminar módulos SCSS no utilizados y podar selectores
- Unificar métodos de update (PUT) y eliminar PATCH no usados
- Unificar Auth (refresh vía servicio)

## Impacto
- Actualizar imports en módulos dependientes
- Verificar rutas y componentes montados

## Verificaciones
- Ejecutar ESLint y TypeScript
- Ejecutar tests existentes
- Build de Vite

## Progreso por lotes
- Lote 1 (features/security UI): Completado
  - Eliminados SCSS no importados (Permissions.scss, Roles.scss, RolePermissionsForm.scss)
  - Podados módulos SCSS usados (.module.scss)
  - Limpieza de imports no usados en RoleForm.tsx y RolePermissionsForm.tsx
- Lote 2 (features/security hooks/servicios/tipos): Completado
  - DTO helpers no usados eliminados (permission.dto.ts, role.dto.ts)
  - Query key no usada eliminada (rolePermissionsKeys)
  - Mensajes no usados eliminados (PermissionForm.messages.ts, components/common.messages.ts)
  - Limpieza de imports de tipos no usados en hooks/servicios
- Lote 3 (Auth + Unificación MSW/Servicios): Completado
  - Auth: refresh unificado vía servicio `authService.refresh` + `silentRefresh` actualizado
  - Users: updates por PUT; handler PATCH eliminado en MSW
  - Roles: handler PATCH eliminado en MSW; updates por PUT
  - Permissions: updates por PUT en servicio
