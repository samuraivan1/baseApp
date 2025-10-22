---
title: Checklist — Aliases, Barriles y Estilos Compartidos
status: draft
---

Objetivo
- Validar uso correcto de alias `@/`, barriles `index.ts` por feature y estilos compartidos.

Checks
- Aliases
  - [ ] No hay imports con rutas relativas de 3+ niveles.
  - [ ] Todos los imports internos usan `@/`.
- Barriles
  - [ ] Cada `features/*` expone `index.ts` con API pública.
  - [ ] `src/core/index.ts` es la vía recomendada para ErrorBoundary, apiClient, queryClient.
- Estilos compartidos
  - [ ] SCSS usa `@use '@/shared/styles/*'` para utilidades compartidas.
  - [ ] No hay duplicación de estilos de tablas si existe `fs-table`.

Automatizable
- Correlacionar contra `docs/rules_registry.json`:
  - `imports.alias.at` (from_code)
  - `architecture.core.barrel.exports` (from_code)
  - `styles.shared.fs-table` (from_code)

