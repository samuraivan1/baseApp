# Prompt Auditor (Tipado y DTOs)

- Aplica las reglas de `TYPES_STANDARD.md`.
- Verifica prefijos `I<Name>` para interfaces y sufijo `DTO`.
- Evita `any`/`unknown`; marca con `// TODO: refine type` si no hay alternativa inmediata.
- Separa `models.ts`, `relations.ts`, `dto.ts` y `schemas`.
- Usa `ApiResponse<T>` y `PaginatedResponse<T>` en servicios.
