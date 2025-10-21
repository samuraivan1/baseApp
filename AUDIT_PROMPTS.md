# Prompts de Auditoría de Tipos

## Tipado y DTOs
- Aplica el estándar `I<Name>`, `<Name>DTO`, `E<Name>`.
- Modelos en camelCase; DTOs fieles al contrato API (snake_case si aplica).
- Prohíbe `any`/`unknown` salvo justificación y `// TODO: refine type`.
- Usa `ApiResponse<T>` y `PaginatedResponse<T>`.
- Exige mappers UI↔API para fechas y claves.

### Prompt sugerido
Analiza todos los tipos e interfaces del proyecto baseApp. Detecta duplicidades, inconsistencias y uso de any. Refactoriza los tipos siguiendo el estándar (I<Name>, <Name>DTO, E<Name>). Actualiza TYPES_STANDARD.md y los prompts.

