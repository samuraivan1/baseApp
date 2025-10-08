# baseApp

Monolito SPA con features modulares y estándares unificados. Consulta la guía principal en `docs/DEVELOPER_GUIDE.md`.

- Playground de desarrollo (DEV):
  - Mutaciones/errores: `/dev/mutation`
  - CRUD de ejemplo (Products): `/dev/products`

Resumen técnico
- Errores: `handleApiError` lanza `AppError`; `useSafeMutation` y toasts unificados.
- Arquitectura: features con barrels públicos; `shared/` solo transversal.
- Estilos: SCSS modular; globales mínimos.
