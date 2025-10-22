---
title: Contribución — Tipos, DTOs y Checklist de PR
status: active
source: from_md
---

# Contribución: Reglas de Tipado y DTOs

## Checklist de PR (obligatorio)
- [ ] Modelos de dominio en camelCase con interfaces `I<Name>` e ids `readonly`.
- [ ] DTOs explícitos: `<Name>RequestDTO` / `<Name>ResponseDTO` en snake_case.
- [ ] Sin alias redundantes (no `CreateXDTO` reexportando RequestDTO).
- [ ] Mappers UI↔API puros para fechas y flags (boolean ↔ 0/1).
- [ ] Enums centralizados con prefijo `E` en `src/shared/types/enums.ts`.
- [ ] Sin `any`/`unknown` no justificados; usar genéricos/Record y `// TODO: refine type` temporal.
- [ ] Zod schemas por entidad y DTO; pruebas de round-trip cuando aplique.

## Dónde va cada cosa
- Dominio: `features/*/types/models.ts` y `relations.ts`.
- DTOs + mappers: `features/*/types/dto.ts` o `api/mappers/*`.
- Enums compartidos: `src/shared/types/enums.ts`.
- Genéricos base: `src/shared/types/api.ts`.

Consulta `docs/01_Estandares/Tipos_y_Contratos.md` y `docs/03_Prompts/prompt_auditoria_baseApp.md` antes de abrir PR.

