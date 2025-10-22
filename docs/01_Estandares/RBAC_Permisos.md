---
title: RBAC y Permisos
status: draft
source: from_code
---

- Fuente de verdad: `src/features/security/constants/permissions.ts`.
- Patrón de permisos: `dominio.recurso.accion`.
- Uso en rutas: `ProtectedRoute` + `hasPermission` del `authStore`.

