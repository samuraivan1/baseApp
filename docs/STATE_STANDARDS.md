# Estado: Estándares Oficiales

- TanStack Query: estado de servidor. Queries y mutations centralizadas por feature en `src/features/<feature>/api/queries.ts`. Llevar `isLoading`, `isError`, `error`, `data` al componente.
- Redux Toolkit: estado global crítico y auditable. Slices en `src/features/<feature>/slice.ts` y registrados en `src/app/store.ts`.
- Zustand: estado efímero por feature. Stores en `src/features/<feature>/store.ts`.

Buenas prácticas: no duplicar estado, no fetch en `useEffect` (usar `useQuery`), documentar hooks/stores con JSDoc, y exponer solo vía `index.ts` de cada feature.

