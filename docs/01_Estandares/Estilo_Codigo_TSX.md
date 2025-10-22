---
title: Estilo de Código TS/TSX
status: draft
source: from_code
---

- Componentes: `PascalCase` por archivo y export por defecto cuando aplica.
- Hooks: prefijo `use` y `camelCase`.
- Tipos: `type` e `interface` descriptivos; `enum` para constantes discretas.
- Query Keys centralizados (`src/constants/queryKeys.ts`).
- Imports absolutos vía alias `@/`.
- Barriles recomendados (`index.ts`) por feature/core para evitar imports internos inestables.
- Ver también: `01_Estandares/Aliases_y_Paths.md`.

## i18n y Mensajes
- Centralizar textos en `src/i18n/commonMessages.ts` y tiparlos con `src/i18n/types.ts`.
- Usar ids estables para acciones y pantallas (ej.: `security.users.list`, `security.roles.update`).
- Evitar strings inline en componentes y schemas; preferir helpers/constantes de mensajes.
