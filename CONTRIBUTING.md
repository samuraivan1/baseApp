# Contribuir a baseApp

Gracias por contribuir. Este documento resume el flujo de trabajo y enlaza a la documentación central. Mantén las PRs pequeñas, tipadas y alineadas a los estándares.

## Flujo de trabajo
- Crea rama desde `main`: `feat/*`, `fix/*`, `docs/*`.
- Sigue commitlint (convencional): `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- Abre PR con descripción clara, checklist y enlaces a issues.

## Checks locales obligatorios
- Lint: `npm run lint`
- Tests: `npm test`
- Auditoría rápida de reglas: `npm run audit:rules`

## Documentación central
- Mapa global: `docs/00_Global_README.md`
- Índice: `docs/SUMMARY.md`
- Estándares clave:
  - Arquitectura FSD: `docs/01_Estandares/Arquitectura_FSD.md`
  - Estilo TS/TSX: `docs/01_Estandares/Estilo_Codigo_TSX.md`
  - SCSS: `docs/01_Estandares/SCSS_Guia_Modular.md`
  - RBAC: `docs/01_Estandares/RBAC_Permisos.md`
  - Tipos y contratos: `docs/01_Estandares/Tipos_y_Contratos.md`
  - Contribución Tipos y PR: `docs/01_Estandares/Contribucion_Tipos_y_PR.md`

## Auditoría y prompts
- Auditoría global: `docs/02_Auditorias/audit_global.md`
- Registro de reglas: `docs/rules_registry.json`
- Prompts operativos: `docs/03_Prompts/prompt_operativo.md`
- Prompts de auditoría: `docs/03_Prompts/prompt_auditoria_baseApp.md`

¿Dudas? Abre un issue con etiqueta `question`.
