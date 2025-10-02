# API Audit — Seguridad y CRUD (OrangeAlex)

Este documento estandariza y valida las APIs de Seguridad (Usuarios, Roles, Permisos) para frontend React + TypeScript y backend futuro en Spring Boot.

## Autenticación

- Reglas
  - Todas las rutas protegidas requieren `Authorization: Bearer <token>`
  - Refresh token disponible en `POST /auth/refresh`
  - Si expira access y refresh → backend responde 401 y el cliente hace logout
- Implementación frontend
  - Interceptor en `src/services/apiClient.ts` adjunta Bearer y refresca en 401 usando `refreshToken()`
  - Servicios añadidos en `src/services/authService.ts`:
    - `POST /auth/login` → `{ access_token, refresh_token, user }`
    - `POST /auth/refresh` → `{ access_token, refresh_token }`
    - `POST /auth/logout` → `204`

## Convención de endpoints REST

- Base: `/api`
- Entidades: plural en colección, `{id}` en singular
- CRUD estándar por entidad:
  - GET `/api/{entity}` → lista (paginación / filtros)
  - GET `/api/{entity}/{id}` → detalle
  - POST `/api/{entity}` → crear
  - PUT o PATCH `/api/{entity}/{id}` → actualizar
  - DELETE `/api/{entity}/{id}` → eliminar

## Endpoints y permisos asociados

- Usuarios (`/api/users`) — permiso por acción (OrangeAlex)
  - GET `/api/users` → `seguridad_usuario:view`
  - GET `/api/users/{user_id}` → `seguridad_usuario:view`
  - POST `/api/users` → `seguridad_usuario:create`
  - PUT/PATCH `/api/users/{user_id}` → `seguridad_usuario:edit`
  - DELETE `/api/users/{user_id}` → `seguridad_usuario:delete`
  - Relación: GET/POST/DELETE `/api/users/{user_id}/roles` → `seguridad_rol:view|edit`

- Roles (`/api/roles`)
  - GET `/api/roles` → `seguridad_rol:view`
  - GET `/api/roles/{role_id}` → `seguridad_rol:view`
  - POST `/api/roles` → `seguridad_rol:create`
  - PUT `/api/roles/{role_id}` → `seguridad_rol:edit`
  - DELETE `/api/roles/{role_id}` → `seguridad_rol:delete`
  - Relación permisos: GET/POST `/api/roles/{role_id}/permissions` → `seguridad_permiso:view|edit`

- Permisos (`/api/permissions`)
  - GET `/api/permissions` → `seguridad_permiso:view`
  - GET `/api/permissions/{permission_id}` → `seguridad_permiso:view`
  - POST `/api/permissions` → `seguridad_permiso:create`
  - PUT `/api/permissions/{permission_id}` → `seguridad_permiso:edit`
  - DELETE `/api/permissions/{permission_id}` → `seguridad_permiso:delete`

## Verificación de servicios frontend

- `src/features/security/api/userService.ts`
  - Usa `api` (apiClient) con Authorization: Sí
  - Mapping de campos → snake_case de BD: Sí (username, first_name, last_name_p, ...)
  - Recomendación: usar `null` en create para opcionales y `undefined` en update para omitir cambio

- `src/features/security/api/roleService.ts`
  - Endpoints relación: `/roles/{roleId}/permissions` — correcto
  - Usa `api` con Authorization: Sí

- `src/features/security/api/permissionService.ts`
  - CRUD en `/permissions` — correcto
  - Usa `api` con Authorization: Sí

- `src/services/api.ts`
  - Endpoints no críticos de Seguridad (menú, tablero). Mantener como están; no requieren permisos de Seguridad.

## Campos y naming (BD)

- Claves: `user_id`, `role_id`, `permission_id`
- Timestamps: `created_at`, `updated_at`, `deleted_at`
- Otros campos User (ejemplo):
```
{
  "user_id": 1,
  "username": "iamendezm",
  "email": "example@empresa.com",
  "first_name": "Alejandro",
  "last_name_p": "Mendez",
  "last_name_m": "Martinez",
  "is_active": 1,
  "mfa_enabled": 0,
  "created_at": "2025-01-15T09:30:00Z",
  "updated_at": "2025-08-20T11:00:00Z"
}
```

## Correcciones aplicadas

- authService: añadido login/refresh/logout con tipos estrictos
- Confirmado uso de apiClient con Bearer + refresh automático
- Validado pluralización de endpoints en services de Seguridad
- Documentados permisos por endpoint para backend Spring Security

## Candidatos a corrección futura (no bloqueantes)

- Homologar PUT vs PATCH en `userService.updateUser` según contrato de backend (actualmente PUT). Recomendación: PATCH para actualizaciones parciales.
- Consolidar fuente de permisos (mock `permissions` legacy vs `permisosEstandar`) cuando backend esté listo.

## Pasos de validación E2E

1) Login
- POST /auth/login → guarda tokens en store y carga menú sin 401

2) Refresh automático
- Expira access_token; en la primera 401 se llama a /auth/refresh y se reintenta la request automáticamente

3) Refresh expirado
- Backend devuelve 401 en /auth/refresh → frontend ejecuta logout y navega a /login

4) CRUD Usuarios/Roles/Permisos
- Probar GET/POST/PATCH/DELETE verificando mapping snake_case y permisos UI (gates)

5) Permisos por rol
- Con usuarios de prueba del mock, confirmar visibilidad de botones y acceso a páginas según rol
