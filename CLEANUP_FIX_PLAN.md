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
