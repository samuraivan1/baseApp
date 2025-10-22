---
title: Autenticación y Sesión (bootstrapAuth)
status: draft
source: from_code
---

Flujo de sesión
- bootstrapAuth: refresca token, obtiene sesión y deriva permisos.
  - Código: `src/shared/auth/bootstrapAuth.ts`.
  - Marca `authReady` al finalizar (éxito o fallo) y setea `isLoggedIn`.
- finalizeLogin: post-login directo, setea usuario y permisos.
- silentRefresh: intenta refresco en background; en fallo, logout.

Reglas
- No renderizar rutas protegidas hasta `authReady=true`.
- Fuente de permisos: `derivePermissions` + `PERMISSIONS`.
- `ProtectedRoute` debe verificar `hasPermission(permiso)`.

Referencias
- `src/index.tsx` (invoca `silentRefresh` al inicio).
- `src/routes/ProtectedRoute.tsx`.
- `src/features/shell/state/authStore`.

