# Guía de Prompts para Coder

## Tipado y DTOs
- Crear interfaces con prefijo `I` para dominio y DTOs con sufijo `DTO`.
- Mantener camelCase en dominio y snake_case en DTOs si la API lo requiere.
- Evitar `any`/`unknown`; usar genéricos y `Record<K,V>`.
- Reutilizar `ApiResponse<T>` y `PaginatedResponse<T>`.
- Añadir `// TODO: refine type` donde no haya validación Zod.

