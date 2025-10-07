Guía de estilos SCSS (OrangeAlex)

Objetivo
- Mantener estilos modulares por componente/página, minimizar herencia global y garantizar coherencia visual.

Principios
- Cada componente importa su propio SCSS local (por ejemplo, `Component/index.tsx` importa `./Component.scss`).
- Globales (`src/styles/_base.scss`, `index.scss`) solo contienen resets, layout general y utilidades transversales no invasivas.
- Las variables y mixins viven en `src/styles/_variables.scss` y `src/styles/_mixins.scss`.
- Evitar selectores globales que alteren componentes; preferir clases locales o utilidades opt‑in.

Estructura
- Global
  - `src/styles/_variables.scss`: colores, tamaños, espaciamiento, radios, tipografía.
  - `src/styles/_mixins.scss`: mixins reutilizables (ej. `input-compact`, `sticky-header`, `hover-row`).
  - `src/styles/_base.scss`: resets y estilos base (html/body/a/img/.main).
  - `src/styles/index.scss`: orquestador que usa variables, mixins y base.
- Shared
  - UI y Common con su SCSS local (Button, Modal, ConfirmDialog, Input, Textarea, LoadingOverlay, PageHeader, CommandBar, EntityTable, Pagination, SectionHeader, FormActions, FormSection, SearchBar).
- Features
  - Cada página o bloque con su SCSS (ej. Security: `Roles.scss`, `Users.scss`, `Permissions.scss`; Shell: `Header.scss`, etc.).

Utilidades y opt‑in
- Form controls: `src/shared/components/common/forms/inputs/FormControls.scss` provee utilidades (`.oa-field`, `.oa-label`, `.oa-error`). No aplica apariencia global a inputs.
- Si se requiere un estilo específico en un componente, definir la clase local en su SCSS y aplicarla explícitamente.

Tablas y paginación
- `EntityTable.scss` y `Pagination.scss` concentran estilos concretos; `fs-table.scss` solo mantiene contenedores/transversales.

Buenas prácticas
- Importar `_variables.scss` y `_mixins.scss` mediante `@use` en los SCSS locales que lo requieran.
- Mantener tamaños compactos (OrangeAlex): inputs/botones delgados, paginador fijo, tabla centrada.
- Antes de añadir un estilo global, considerar si debe vivir en el SCSS del componente.

Proceso de cambios
- Si un estilo global afecta visualmente un componente, muévelo al SCSS del componente y añade el import local.
- No eliminar variables; centralizar valores repetidos en `_variables.scss` cuando se detecten.

