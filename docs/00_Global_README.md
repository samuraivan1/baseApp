---
title: Global README
version: 0.1.0
status: draft
updated: 2025-10-22
---

# BaseApp — Global Overview

Este documento centraliza visión, arquitectura, estándares y enlaces de referencia del proyecto baseApp.

## Resumen ejecutivo
- App React + TypeScript con arquitectura modular por features (FSD-like).
- Gestión de datos con TanStack Query y API client centralizado.
- Estilos con SCSS módulos y puente de variables hacia tokens CSS.
- Mocks MSW para desarrollo y auditorías de errores/seguridad.

## Arquitectura (FSD)
- Estructura por `features/*` más capas `shared/`, `core/`, `lib/` y `routes/`.
- Rutas declaradas en `src/routes/AppRoutes.tsx` con `ProtectedRoute` para RBAC.
- Providers globales en `src/core/providers.tsx` (QueryClient, Theme, ErrorBoundary).
  - Core expone barril en `src/core/index.ts` (ErrorBoundary, apiClient, queryClient).

## Integración y librerías
- React, React Router, TanStack Query, MSW, Redux Toolkit (store base), Vite.
- Ver `docs/DEVELOPER_GUIDE.md`, `docs/API_CONSUMPTION_RULES.md` y `docs/ERROR_HANDLING.md` (existentes).

## Global Design System (GDS)
- Tokens iniciales en `src/core/tokens.ts` y puente SCSS en `src/styles/_bridge.scss`.
- Guía SCSS en `01_Estandares/SCSS_Guia_Modular.md` (pendiente, ver estructura).

## Reglas unificadas (resumen)
- Naming: Componentes `PascalCase`, hooks `useCamelCase`, funciones/vars `camelCase`.
- Estilos: SCSS con `@use`, mixins centralizados; variables vía tokens CSS.
- Datos: Query Keys centralizados en `src/constants/queryKeys.ts`.
- Seguridad: Ruta protegida y permisos en `features/security` (RBAC por constantes).

Detalles por categoría en `01_Estandares/*` y registro JSON en `rules_registry.json`.

## Estructura documental
```
docs/
  00_Global_README.md
  01_Estandares/
  02_Auditorias/
  03_Prompts/
  04_Logs/
  SUMMARY.md
```

Auditorías clave
- Auditoría Global: `docs/02_Auditorias/audit_global.md`
- Aliases/Barriles/Estilos: `docs/02_Auditorias/audit_aliases_barriles_estilos.md`
- Frontend: `docs/02_Auditorias/audit_frontend.md`
- SCSS: `docs/02_Auditorias/audit_scss.md`

## Scripts útiles
- Ejecutar auditoría rápida de reglas: `npm run audit:rules`

## Normativa base
- Manifesto del proyecto: ver `manifest.md` (raíz) como fuente normativa principal.
- Guías complementarias: `docs/DEVELOPER_GUIDE.md`, `docs/CODING_RULES.md`, `docs/API_CONSUMPTION_RULES.md`, `docs/ERROR_HANDLING.md`, `docs/API_MOCKS.md`.

## Flujo de sesión y RBAC
- Resumen: autenticación basada en `bootstrapAuth`, `silentRefresh` y guardas de ruta con permisos.
- Detalle: ver `docs/01_Estandares/Auth_Sesion.md`.
- Código clave: `src/shared/auth/bootstrapAuth.ts`, `src/shared/auth/silentRefresh.ts`, `src/routes/ProtectedRoute.tsx`, `src/features/shell/state/authStore.ts`.

## Cómo contribuir
- Proponer cambios vía PR con actualización de `rules_registry.json` si aplica.
- Mantener enlaces cruzados en `SUMMARY.md`.

## Historial y trazabilidad
- Logs en `04_Logs/`. Documentos antiguos marcados con YAML `status: archived`.
