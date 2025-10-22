# API Mocks y Endpoints (MSW)

Esta guía documenta todos los endpoints expuestos por los handlers de MSW y su uso desde los servicios del front. Incluye payloads de ejemplo y comandos curl para probarlos.

Notas generales
- Prefijo base: `/api`.
- Autenticación: endpoints de negocio requieren sesión; en mocks, el login entrega `access_token` (Bearer) + `csrf_token`.
- CSRF: métodos de escritura envían `X-CSRF-Token` automáticamente vía `apiClient` tras login/refresh.

Autenticación
- POST `/api/auth/login`
  - Body JSON: `{ "username": "admin", "password": "..." }` (o `email`)
  - 200 OK: `{ user, access_token, refresh_token, expires_in, csrf_token }`
  - curl: `curl -X POST http://localhost:5173/api/auth/login -H 'Content-Type: application/json' -d '{"username":"admin","password":"admin"}'`

- POST `/api/auth/refresh`
  - Body: `{ refresh_token? }` (en mocks se ignora)
  - 200 OK: `{ access_token, refresh_token, expires_in, csrf_token, user? }`
  - curl: `curl -X POST http://localhost:5173/api/auth/refresh -c cookies.txt -b cookies.txt`

- POST `/api/auth/logout`
  - 204 No Content
  - curl: `curl -X POST http://localhost:5173/api/auth/logout -c cookies.txt -b cookies.txt`

- GET `/api/auth/session`
  - 200 OK: `{ user }`
  - curl: `curl http://localhost:5173/api/auth/session -H 'Authorization: Bearer <token>'`

Configuración
- GET `/api/config`
  - 200 OK: `{ "API_BASE_URL": "/api" }`
  - curl: `curl http://localhost:5173/api/config`

Menú de navegación
- GET `/api/menu`
  - 200 OK: `NavMenuItem[]`
  - curl: `curl http://localhost:5173/api/menu -H 'Authorization: Bearer <token>'`

- GET `/api/menuPerfil`
  - 200 OK: `NavMenuItem[]`
  - curl: `curl http://localhost:5173/api/menuPerfil -H 'Authorization: Bearer <token>'`

Usuarios
- GET `/api/users`
  - 200 OK: `UserResponseDTO[]`
  - curl: `curl http://localhost:5173/api/users -H 'Authorization: Bearer <token>'`

- GET `/api/users/:id`
  - 200 OK: `UserResponseDTO`
  - curl: `curl http://localhost:5173/api/users/1 -H 'Authorization: Bearer <token>'`

- POST `/api/users`
  - Body: `CreateUserRequestDTO`
  - 201 Created: `UserResponseDTO`
  - curl: `curl -X POST http://localhost:5173/api/users -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' -d '{"first_name":"..."}'`

- PUT `/api/users/:id`
  - Body: `UpdateUserRequestDTO | { is_active?: 0|1, mfa_enabled?: 0|1 }`
  - 200 OK: `UserResponseDTO`
  - curl: `curl -X PUT http://localhost:5173/api/users/1 -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' -d '{"first_name":"..."}'`

- DELETE `/api/users/:id`
  - 204 No Content
  - curl: `curl -X DELETE http://localhost:5173/api/users/1 -H 'Authorization: Bearer <token>'`

Roles
- GET `/api/roles`
- GET `/api/roles/:id`
- POST `/api/roles`
- PUT `/api/roles/:id`
- DELETE `/api/roles/:id`
  - Igual que usuarios, con `RoleResponseDTO`.
  - curl ej: `curl http://localhost:5173/api/roles -H 'Authorization: Bearer <token>'`

Permisos
- GET `/api/permissions`
- GET `/api/permissions/:id`
- POST `/api/permissions`
- PUT `/api/permissions/:id`
- PATCH `/api/permissions/:id`
- DELETE `/api/permissions/:id`
  - Igual que usuarios/roles, con `PermissionResponseDTO`.

Relaciones (Usuarios-Roles)
- GET `/api/user_roles`
  - 200 OK: `UserRole[]`
  - curl: `curl http://localhost:5173/api/user_roles -H 'Authorization: Bearer <token>'`

- POST `/api/user_roles`
  - Body: `{ user_id, role_id }`
  - 201 Created: `UserRole`
  - curl: `curl -X POST http://localhost:5173/api/user_roles -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' -d '{"user_id":1,"role_id":2}'`

- DELETE `/api/user_roles/:user_id/:role_id`
  - 204 No Content
  - curl: `curl -X DELETE http://localhost:5173/api/user_roles/1/2 -H 'Authorization: Bearer <token>'`

Relaciones (Roles-Permisos)
- GET `/api/role_permissions`
  - 200 OK: `RolePermission[]`
  - curl: `curl http://localhost:5173/api/role_permissions -H 'Authorization: Bearer <token>'`

- POST `/api/role_permissions`
  - Body: `{ role_id, permission_id }`
  - 201 Created: `RolePermission`
  - curl: `curl -X POST http://localhost:5173/api/role_permissions -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' -d '{"role_id":1,"permission_id":3}'`

- DELETE `/api/role_permissions/:role_id/:permission_id`
  - 204 No Content
  - curl: `curl -X DELETE http://localhost:5173/api/role_permissions/1/3 -H 'Authorization: Bearer <token>'`

Kanban (Board)
- GET `/api/board`
  - 200 OK: `Board`
  - curl: `curl http://localhost:5173/api/board -H 'Authorization: Bearer <token>'`

- PUT `/api/board`
  - Body: `Board`
  - 200 OK: `Board`
  - curl: `curl -X PUT http://localhost:5173/api/board -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' -d '{"columns":[...]}'`

Genéricos (fallback CRUD)
- GET `/api/:collection`
- GET `/api/:collection/:id`
- POST `/api/:collection`
- PUT `/api/:collection/:id`
- PATCH `/api/:collection/:id`
- DELETE `/api/:collection/:id`
  - Opera sobre colecciones del mock DB (ver `src/mocks/data/db.ts`).
  - curl ej: `curl http://localhost:5173/api/any_collection -H 'Authorization: Bearer <token>'`

Desarrollo (forzar errores)
- POST `/api/dev/force-422`
- GET `/api/dev/force-401`
- GET `/api/dev/force-403`
- GET `/api/dev/force-404`
  - curl ej: `curl -X POST http://localhost:5173/api/dev/force-422`

Observaciones
- Todos los endpoints bajo `/api` están protegidos por el mock de auth (salvo dev/config en algunos casos). Loguéate antes de probar.
- El cliente del front (`apiClient`) agrega automáticamente `Authorization: Bearer <token>` y `X-CSRF-Token` según corresponda tras login/refresh.
