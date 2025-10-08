# Guía de Desarrollo Unificada

Este documento consolida el estándar de programación del proyecto: arquitectura, reglas de imports, estilos, estado, autenticación e i18n.

## Arquitectura y Módulos
- SPA monolítica con features en `src/features/*` y cross‑cutting en `src/shared/*`.
- Cada feature expone su API pública vía `src/features/<feature>/index.ts` (y opcionales `types/index.ts`, `components/index.ts`).
- Solo se permiten imports externos desde los barrels públicos del feature.
- Mantén `shared/` mínimo; si algo es específico de un feature, ubícalo allí.

## Reglas de Imports
- ESLint `import/no-internal-modules` activo para evitar deep imports.
- Si necesitas un símbolo externamente, re‑expórtalo en el `index.ts` del feature.
- Usa paths absolutos (`@/features/...`, `@/shared/...`).

## Estado y Errores
- Servicios normalizan errores con `handleApiError` y lanzan `AppError`.
- Hooks consumen `onError` consistente con `mapAppErrorMessage` y `useSafeMutation`.
- UI unifica toasts (`showToast*`) y `ErrorBoundary` con “Reintentar”.

## Estilos
- SCSS modular por componente; globales mínimos (`_variables.scss`, `_mixins.scss`, `_base.scss`, `index.scss`).
- Evita estilos globales invasivos; usa utilidades opt‑in y clases locales.
- Shared UI/Common con sus propios SCSS locales; features con sus estilos por página/bloque.

## Autenticación
- Cliente HTTP único en `src/shared/api/apiClient.ts` con JWT y refresh (cookie HttpOnly).
- Interceptores: añaden `Authorization` y gestionan `401` con refresh automático; CSRF en mutaciones.

## i18n
- Sin literales visibles en JSX; usa `*.messages.ts` por componente/feature.
- Claves con prefijo de bloque: `users.form.email`, `roles.table.description`, etc.

## Convenciones de Estructura (resumen)
```
src/
  features/
    <feature>/
      index.ts            // barrel público
      components/
        index.tsx         // re‑exports internos del feature
      hooks/
      api/
      types/
        index.ts
  shared/
    components/
    hooks/
    api/
    styles/
```

### Detalle de arquitectura (ejemplo ampliado)

SPA Monolith — Modular Features

```
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
```

Convenciones clave
- Importa features solo desde su API pública: `import { LoginPage } from '@/features/auth'`.
- No deep imports externos: prohibidos `@/features/auth/components/...` desde otros features.
- Si algo debe ser consumido externamente, re‑exporta desde `index.ts` del feature.
- Mantén `shared/` mínimo y transversal; si algo solo lo usa un feature, muévelo al feature.

ESLint
- Regla activa: `import/no-internal-modules`.
- Añade símbolos a la API pública de cada feature (`index.ts`) para cumplir la regla.

## Contribución
- Añade/ajusta exports en barrels al exponer nuevas APIs.
- Cumple `import/no-internal-modules` evitando deep imports externos.
- Mantén documentación en este archivo; evita crear nuevos `.md` salvo necesidad clara.

## Commits y PRs
- Commits: Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`).
- Mensajes breves en el título (máx. 72 chars) y detalle en el body si aplica.
- PRs deben incluir descripción clara, alcance y notas de migración si rompen contratos.
- Pasa el checklist del PR y enlaza issues relacionados.

## Testing mínimo
- Unit: utilidades y funciones puras (inputs/outputs claros).
- Hooks: casos no triviales (estado derivado, reintentos, errores).
- Componentes: rutas/críticos (render básico y acciones principales).
- Evita tests frágiles (snapshots masivos); prioriza comportamiento.

## Rendimiento y Accesibilidad
- Divide código por rutas/features cuando sea posible (lazy + suspense).
- Usa memoización prudente (`useMemo`, `useCallback`) solo si hay costo real.
- A11y: etiquetas, roles y foco gestionado; no depender solo de color.

## Seguridad (frontend)
- Nunca loggear tokens. Guarda solo lo estrictamente necesario.
- Cookies HttpOnly para refresh; `withCredentials` en cliente HTTP; CSRF en mutaciones.
- Sanitiza/escapa HTML si renderizas contenido dinámico.

## Reglas rápidas (Do/Don’t)
- Do: importar desde barrels públicos de features.
- Don’t: `@/features/<f>/components/...` desde otros features.
- Do: centralizar errores en servicios y mapear mensajes de usuario.
- Don’t: lanzar strings sueltos; usa `AppError` y mapeos.
- Do: estilos modulares por componente y tokens globales.
- Don’t: estilos globales invasivos.
