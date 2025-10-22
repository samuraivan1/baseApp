---
title: Aliases y Paths
status: draft
source: from_code
---

Alias `@/`
- Se usa para importaciones absolutas desde `src/`.
- Ejemplos de uso:
  - `import { Home } from '@/features/home';`
  - `import apiClient from '@/shared/api/apiClient';`
  - `@use '@/shared/styles/fs-table';` (en SCSS)

Configuración (validada)
- Vite: `vite.config.js` define alias `@` → `./src`.
- TypeScript: `tsconfig.json` mapea `@/*` → `src/*`.

Buenas prácticas
- Preferir alias sobre rutas relativas profundas (`../../..`).
- Mantener barriles (`index.ts`) para superficies públicas por carpeta.

Ejemplos prácticos
- TSX (feature import):
  ```ts
  import { UsersPage } from '@/features/security';
  import { ErrorBoundary } from '@/core';
  import apiClient from '@/shared/api/apiClient';
  ```
- SCSS (estilos compartidos):
  ```scss
  @use '@/shared/styles/fs-table';
  .users-table {
    @include fs-table.compact;
  }
  ```

Checklist rápido
- [ ] Todos los imports usan `@/` en lugar de rutas relativas profundas.
- [ ] Cada feature exporta un barril `index.ts` con su API pública.
- [ ] `core/index.ts` se usa para importar utilidades de plataforma.
- [ ] Los estilos compartidos se consumen vía alias en SCSS cuando aplique.
