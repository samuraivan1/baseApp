---
status: archived
reason: "Movido desde raíz a /docs/03_Prompts/"
---

<!-- Archivo movido desde la raíz. Contenido original preservado abajo. -->

# Prompt Auditor (Tipado y DTOs)

- Aplica las reglas de `docs/01_Estandares/Tipos_y_Contratos.md`.
- Verifica prefijos `I<Name>` para interfaces y sufijo `DTO`.
- Evita `any`/`unknown`; marca con `// TODO: refine type` si no hay alternativa inmediata.
- Separa `models.ts`, `relations.ts`, `dto.ts` y `schemas`.
- Usa `ApiResponse<T>` y `PaginatedResponse<T>` en servicios.
