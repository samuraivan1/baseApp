# baseApp — Estándar de Manejo de Errores (OrangeAlex)

Este proyecto implementa el estándar OrangeAlex para manejo de errores en React + TypeScript.

- Guía completa: `README_ERRORS.md`
- Rutas de desarrollo (solo DEV):
  - Playground de mutaciones/errores: `/dev/mutation`
  - CRUD de ejemplo (Products): `/dev/products`

Resumen técnico
- Servicios: normalización con `handleApiError` (lanza `AppError`).
- Hooks: `onError` consistente con `mapAppErrorMessage` y `useSafeMutation`.
- UI: toasts unificados (`showToast*`) y `ErrorBoundary` con botón Reintentar.

