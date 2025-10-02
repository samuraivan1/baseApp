# Auditoría y Normalización de Permisos (OrangeAlex)

Este documento resume la auditoría aplicada al sistema de permisos y los cambios de normalización realizados para alinear el código y los datos (db.json) al estándar OrangeAlex.

## Estándar

- Páginas: `page:[modulo]_[submodulo]:view`
- CRUD entidad: `[modulo]_[entidad]:view|create|edit|delete` (entidad en singular)
- Extendidos: `[modulo]_[entidad]:[accionEspecial]`

## Alcance analizado

- Código: `routes/AppRoutes.tsx`, `pages/Security/*`, `components/common/*`, `features/security/constants/{permissions.ts,routePermissions.ts}`
- Datos: `db.json`

## A) Permisos correctos (conforme estándar)

- Páginas
  - `page:seguridad_usuarios:view`
  - `page:seguridad_roles:view`
  - `page:seguridad_permisos:view`

- CRUD por entidad (nivel 2)
  - `seguridad_usuario:{view,create,edit,delete}`
  - `seguridad_rol:{view,create,edit,delete}`
  - `seguridad_permiso:{view,create,edit,delete}`

## B) Permisos mal escritos (antes → después)

- Acciones con prefijo `page:seguridad_*:{create|edit|delete}` → usar CRUD de entidad
  - `page:seguridad_usuarios:create|edit|delete` → `seguridad_usuario:create|edit|delete`
  - `page:seguridad_roles:create|edit|delete` → `seguridad_rol:create|edit|delete`
  - `page:seguridad_permisos:create|edit|delete` → `seguridad_permiso:create|edit|delete`

## C) Acciones sin permiso asociado (corregidas)

- Botón “Nuevo” en CommandBar:
  - Users: protegido con `seguridad_usuario:create`
  - Roles: protegido con `seguridad_rol:create`
  - Permisos: protegido con `seguridad_permiso:create`

## D) Permisos en db.json no usados

- Se conservan permisos legacy bajo `permissions` (p. ej., `user:system:*`, `role:system:*`). Se marcan como candidatos a revisión si se prescinde del modelo legacy.

## E) Permisos usados en código y ausentes en db.json

- Añadidos en nueva colección `permisosEstandar` con shape solicitado (idPermiso, permiso, modulo, entidad, accion, descripcion).

## Implementación realizada

1) Datos (db.json)
   - Colección `permisosEstandar` creada con:
     - Páginas: `page:seguridad_usuarios:view`, `page:seguridad_roles:view`, `page:seguridad_permisos:view`.
     - CRUD: `seguridad_usuario:*`, `seguridad_rol:*`, `seguridad_permiso:*`.

2) Código
   - constants/permissions.ts: ActionPermissions con permisos de entidad (create/edit/delete). Página en routePermissions.ts.
   - Users/Roles/Permisos: PermissionGate actualizado para usar permisos de entidad en acciones y CommandBar.

## Roles y asignación sugerida (db.json)

- Rol Super Administrador: todos los permisos (páginas y CRUD).
- Rol Usuario Básico: únicamente `page:seguridad_*:view`.
- Rol Validador: `page:seguridad_*:view` + `seguridad_rol:view|edit` (y otras combinaciones según pruebas).

Usuarios de prueba:
- user_id=1 → Super Administrador
- user_id=2 → Usuario Básico
- user_id=3 → Validador

> Nota: La colección `permisosEstandar` convive con la legacy `permissions` para no romper integraciones actuales. Siguiente fase: consolidar a una única fuente cuando se apruebe la limpieza.

