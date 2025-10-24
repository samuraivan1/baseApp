# Tech Charter — BaseApp Enterprise OSS v1.1

## Visión Técnica
Plataforma OSS empresarial, trazable end-to-end, con FSD + TS estricto, RBAC y observabilidad nativa.

## Árbol de decisiones arquitectónicas
- FSD por capas: app, processes, pages, widgets, features, entities, shared.
- Observabilidad: traceId (uuidv7) FE/BE, collector `/api/client-logs`.
- Errores: `AppError` tipado, catálogo y `errorHandler` unificado.
- UI: Design System 2.0 (tokens + arquetipos) + Storybook.
- Calidad: Vitest, MSW, cobertura ≥ 80%.

## Convenciones de nombrado
- Archivos y carpetas: kebab-case; tipos e interfaces: PascalCase; variables: camelCase.
- Commits: Conventional Commits.

## Política de ramas y commits
- main protegido; develop integración; feature/* por tarea.
- Commits con `feat|fix|chore|refactor|docs|test|ci` scope opcional.

## Definición de DONE
- Código tipado, lint sin errores, pruebas unitarias y snapshots si aplica.
- Documentación actualizada (README/Storybook) y trazabilidad por `traceId` verificada.
- Auditoría registrada en `auditService` cuando aplica.

## Matriz de responsabilidades
- Arquitectura: velar por FSD, observabilidad y Tech Charter.
- Frontend: Design System, interceptores, error handler, i18n.
- Backend: middleware trace, `/client-logs`, `/audit-logs`.
- QA: BDD + snapshots, cobertura y pipelines.

## Estándares internos
- 2.7 UI, 2.8 API, 2.9 QA adoptados en CI y PR templates.

