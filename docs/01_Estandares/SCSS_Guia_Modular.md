---
title: Guía SCSS Modular
status: draft
source: from_code
---

- Uso de `@use` y `@mixin` (`src/styles/_base.scss`, `_mixins.scss`).
- Puente de variables legacy a tokens CSS en `src/styles/_bridge.scss`.
- Tokens: preferir `var(--color-*)` y mapear a `$` solo cuando sea necesario.
- Convención de nombres: BEM recomendado para componentes.
- Importaciones SCSS con alias: `@use '@/shared/styles/fs-table';`.
