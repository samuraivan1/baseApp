Coding agent notes for this repo

- Architecture: SPA monolith with modular features under `src/features/*` and a minimal cross-cutting `src/shared/*`.
- Public API: Every feature exposes `src/features/<feature>/index.ts` (and optional `types/index.ts`, `components/index.ts`). External code must import only from these public barrels.
- Shared: Keep only transversal UI, hooks, api clients under `src/shared`. Prefer pushing logic into features when it’s feature-specific.
- Linting: `import/no-internal-modules` is enabled in `src/.eslintrc.js` to prevent deep imports. If you need a symbol externally, re-export it from the feature's `index.ts`.
- Paths: Absolute imports via tsconfig baseUrl/aliases (e.g., `@/features/...`).

Working rules
- When adding a new feature, create `index.ts` to define its public surface.
- Do not import from `components/*`, `hooks/*`, or `api/*` of another feature directly; consume their re-exports via the feature barrel.
- Keep shared lean. If something is only used by one feature, keep it in that feature.
