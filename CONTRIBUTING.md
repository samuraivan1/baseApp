# Contributing Guide

This repo follows a feature‑oriented architecture designed for production apps. Please read and follow these conventions before adding or changing code.

## Project Architecture

- `features/<domain>` — Business logic by domain
  - `types.ts` — Single source of truth for domain types (interfaces, enums)
  - `api/` — HTTP clients (no React). Consume `types.ts`. No side effects beyond requests.
  - `hooks/` — React hooks that orchestrate API, caching, and UI state
  - `utils/` — Pure domain helpers
- `components/common/` — Internal UI library (domain‑agnostic). No imports from `features`.
- `pages/` — Route screens. Compose common components and domain hooks.
- `types/` — Aggregators that re‑export domain types, e.g. `@/types/security`.
- `styles/` — Global tokens and shared styles (`_variables.scss`, `_mixins.scss`, etc.)

## Type Rules

- Define all domain types in `features/<domain>/types.ts`.
- Do not duplicate interfaces in services, hooks, or pages.
- Import types via `@/types/<domain>` (aggregated) unless you need deep domain imports.
- Keep validation schemas (Zod/Yup) separate from `types.ts`.

## API Rules

- Only functions (no React) in `features/<domain>/api/`.
- Use domain types for request/response shapes.
- Centralize error normalization in a shared error service if necessary.

## Hooks Rules

- All hooks live in `features/<domain>/hooks/`.
- Hooks expose minimal data + actions; UI decisions stay in pages/components.

## UI Rules

- Components in `components/common/` must be domain‑agnostic.
- Style using tokens from `styles/_variables.scss` (e.g., `--control-height-sm`, `--font-size-sm`).
- No HTTP calls inside common components.

## Imports & Aliases

- Use `@` for absolute imports from `src`.
- Types: `@/types/<domain>`.
- Features: `@/features/<domain>/<area>` (api, hooks, utils).
- Common components: `@/components/common/...`.

## State, Data & Pagination

- Fetch and filter data in hooks/pages; pass results to tables/components.
- Pagination should be controlled by the page. Prefer passing a custom footer (slot) to tables.

## Styling

- Prefer CSS variables declared in `styles/_variables.scss` for sizes, colors and radii.
- Avoid “magic numbers” — add/extend tokens when needed.

## Testing

- Unit test pure utils/functions.
- Component tests for critical UI.
- Hook tests where logic is non‑trivial.

## Commit Style

- Use Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:` etc.

## PR Checklist

- [ ] Types defined in `features/<domain>/types.ts`
- [ ] No domain imports inside `components/common`
- [ ] API uses domain types; hooks compose API
- [ ] Styling uses tokens
- [ ] Build and basic flows verified

