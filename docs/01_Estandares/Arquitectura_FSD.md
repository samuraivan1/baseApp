---
title: Arquitectura FSD
status: draft
source: from_code
---

- Capas: `features/`, `shared/`, `core/`, `lib/`, `routes/`.
- `features/*` expone API público vía `index.ts`.
- Rutas y lazy loading en `src/routes/AppRoutes.tsx`.
- Guardias `ProtectedRoute` con `useAuthStore` y permisos.

## Core y Barriles
- Barril `src/core/index.ts` expone utilidades de plataforma:
  - `ErrorBoundary` (desde shared/components)
  - `apiClient`, `getBaseURL` (cliente HTTP centralizado)
  - `queryClient` (config de TanStack Query)
- Beneficios: import paths estables, superficie pública controlada, menor acoplamiento.
