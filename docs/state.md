Guía de estado: TanStack Query vs Zustand

Objetivo
- Definir claramente qué estado va en Query (remoto) y qué va en Zustand (UI/sesión/derivado) para mantener apps escalables.

Qué va en TanStack Query
- Datos remotos (API): fetch, caché, invalidación, reintentos, estados de carga/error.
- Estructura por feature: `src/features/<feature>/api/queries.ts` orquesta las operaciones con `useQuery`/`useMutation` usando servicios de `api/*.ts`.
- No guardar en Query datos puramente locales.

Qué va en Zustand
- Estado global de UI/sesión (ej.: authReady, user, toggles, paneles abiertos/cerrados).
- Estado interactivo/derivado de widgets complejos (ej.: tablero en edición) sin reemplazar la fuente remota (que vive en Query).
- Persistencia: sólo para preferencias de UI o flags de auth (`auth:revoked`, `csrf_token`). Evitar persistir tokens de acceso.

Patrón recomendado
1) Servicios puros: `api/*.ts` con axios (sin React), tipados.
2) Hooks Query: `queries.ts` consumen servicios y exponen `useQuery`/`useMutation` + invalidación.
3) Stores Zustand: manejan estado transversal de UI/sesión y estados derivados de componentes.
4) Componentes consumen hooks Query para datos y stores para UI.

Ejemplos del repo
- Security: `features/security/api/queries.ts` (remoto), `authStore` (sesión en `features/shell/state`).
- Kanban: `useKanbanBoard` (Query para tablero) + `boardStore` (UI/derivados).
- Menú: `useMainMenu`/`useProfileMenu` (Query) + `menuStore` (UI, sin persistencia por ahora).

Antipatrones a evitar
- Usar Zustand como caché de datos remotos en lugar de Query.
- Usar Query para toggles o estado efímero de UI.

