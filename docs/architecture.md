SPA Monolith — Modular Features

Propuesta de estructura final (ejemplo)

src/
  index.tsx
  routes/
    AppRoutes.tsx
    ProtectedRoute.tsx
  features/
    auth/
      index.ts             // API pública
      LoginPage/
        index.tsx
      components/
        index.tsx          // re-exports internos del feature
        validationSchema.ts
      hooks/
      api/
      types/
        index.ts
    home/
      index.ts
      components/
        index.tsx
    security/
      index.ts
      api/
      hooks/
      components/
        index.tsx
    kanban/
      index.ts
      components/
        index.tsx
  shared/
    index.ts               // API pública transversal (opcional)
    components/
      ui/
        Button/
          index.tsx
        Modal/
          index.tsx
      common/
        PageHeader/
          index.tsx
    hooks/
      useApiError/
        index.ts
    api/
      apiClient.ts
      logger.ts
      services/
        contactService.ts
    types/
      ui.ts
      security.ts

Convenciones clave
- Importa features solo desde su API pública: import { LoginPage } from '@/features/auth'
- No deep imports externos: prohibidos '@/features/auth/components/..' desde otros features.
- Si algo debe ser consumido externamente, re-exporta desde index.ts del feature.
- Mantén shared/ mínimo y transversal; si algo solo lo usa un feature, muévelo al feature.

ESLint
- Regla activa: import/no-internal-modules
- Añade símbolos a la API pública de cada feature (index.ts) para cumplir la regla.
