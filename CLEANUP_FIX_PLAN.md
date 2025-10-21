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
- Remover exports no usados en archivos listados en "Exports no usados".
- Eliminar módulos SCSS no importados.
- Podar selectores SCSS no referenciados en módulos usados.
- Eliminar tipos/DTOs no referenciados.
- Eliminar assets no referenciados o mover a Home si son ejemplos.

## Impacto
- Actualizar imports en módulos dependientes.
- Verificar rutas y componentes montados en src/routes y features/shell.

## Verificaciones
- Ejecutar ESLint y TypeScript.
- Ejecutar tests existentes.
- Build de Vite.

## Progreso por lotes
- Lote 1 (features/security UI): Completado
  - Eliminados SCSS no importados (Permissions.scss, Roles.scss, RolePermissionsForm.scss)
  - Podados módulos SCSS usados (.module.scss)
  - Limpieza de imports no usados en RoleForm.tsx y RolePermissionsForm.tsx
- Lote 2 (features/security hooks/servicios/tipos): En progreso
  - Sin cambios destructivos; siguiente paso: podar imports no usados en hooks/servicios/tipos
