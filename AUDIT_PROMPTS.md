# Prompts de Auditoría

Guías y referencias para auditoría automatizada del proyecto baseApp.

Referencias centrales
- Registro de reglas: `docs/rules_registry.json`
- Auditoría Global: `docs/02_Auditorias/audit_global.md`
- Aliases/Barriles/Estilos: `docs/02_Auditorias/audit_aliases_barriles_estilos.md`
- Auditoría Frontend: `docs/02_Auditorias/audit_frontend.md`
- Auditoría SCSS: `docs/02_Auditorias/audit_scss.md`

## Tipado y DTOs
- Aplica el estándar `I<Name>`, `<Name>DTO`, `E<Name>`.
- Modelos en camelCase; DTOs fieles al contrato API (snake_case si aplica).
- Prohíbe `any`/`unknown` salvo justificación y `// TODO: refine type`.
- Usa `ApiResponse<T>` y `PaginatedResponse<T>`.
- Exige mappers UI↔API para fechas y claves.

### Prompt sugerido (tipos)
Analiza todos los tipos e interfaces del proyecto baseApp. Detecta duplicidades, inconsistencias y uso de any. Refactoriza los tipos siguiendo el estándar (I<Name>, <Name>DTO, E<Name>). Actualiza TYPES_STANDARD.md y los prompts.

## Auditoría de estructura y estilos
Analiza el uso de alias `@/`, barriles `index.ts` y estilos compartidos SCSS.

### Prompt sugerido (estructura)
Usa `docs/rules_registry.json` y los checklists en `docs/02_Auditorias/` para identificar desviaciones. Propón refactors concretos con rutas de archivo afectadas.

## Ejecución rápida (script)
- Script: `node scripts/audit-rules.js`
- Requisitos: Node 18+, ripgrep opcional (`rg`) para búsqueda rápida; si no está, usa `grep`.
- Salida: resumen (ERROR/WARN/INFO). Retorna código 1 si hay errores críticos.
