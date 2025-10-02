# Guía de Estilos y Componentes (OrangeAlex)

Esta guía resume las decisiones y prácticas aplicadas en los Sprints 1–4 para normalizar estilos en el proyecto React + TypeScript + SCSS (look & feel OrangeAlex). Está pensada para que el equipo mantenga consistencia visual y de código, sin romper contratos de componentes ni i18n.

## Objetivos
- Mantener OrangeAlex: compacto, sobrio, acento naranja (`#F26822`).
- Evitar herencia profunda de estilos; encapsular SCSS por componente.
- Usar tokens y mixins globales; cero `any` en TS.
- No cambiar APIs, props ni textos visibles.

## Estructura relevante
- `src/styles/_variables.scss`: Tokens (colores, tipografías, espaciados, radios, sombras, z-index) + CSS custom properties.
- `src/styles/_mixins.scss`: Mixins reutilizables (focus-ring, input-compact, helpers de tablas, etc.).
- `src/components/ui`: Componentes atómicos (Button, Input, Textarea, Modal, Spinner, etc.).
- `src/components/common`: Componentes compuestos (CommandBar, EntityTable, Pagination, ListLoading, ConfirmDialog, etc.).

## Tokens (variables) — Resumen
- Colores (SCSS + CSS vars):
  - `--color-primary`: naranja corporativo (OrangeAlex) y `--color-primary-hover`.
  - `--color-text-primary`, `--color-text-on-primary`, `--surface-bg`, `--surface-border`.
  - Paleta de apoyo (grises/bordes) y overlay (`--overlay-bg`, `--overlay-blur`).
- Tipografía y tamaños:
  - `--font-size-sm`, `--font-size-md`, `--font-size-lg` (1.75rem para headers).
- Controles y espaciados:
  - `--control-height-sm`, `--control-height-md` (~36px), `--control-height-lg`.
  - `--spacing-sm`, `--spacing-md`, `--spacing-lg`.
- Bordes, sombras y z-index:
  - `--border-radius-small`, `--border-radius-medium`.
  - `--box-shadow-md`, `--z-modal`.

## Mixins clave
- `@include input-compact()`: altura compacta (~36px), padding uniforme, borde/focus accesible.
- `@include focus-ring($color)`: halo de foco sutil y accesible.
- `@include sticky-header($top)`: encabezado de tabla pegajoso.
- `@include hover-row($bg)`: hover suave para filas.

Importación recomendada en SCSS:
```
@use '../../styles/_mixins' as mix;
@use '../../styles/_variables' as vars;
// ...
selector { @include mix.input-compact(); }
```

## Patrones por componente

### Botón (`ui/Button`)
- Variantes: `primary`, `secondary`, `danger`, `link`, `outline`, `ghost`, `subtle`.
- Tamaños: `small`, `medium` (~36px), `large`.
- Estados: hover con `--color-primary-hover`; `:focus-visible` con halo sutil.
- Loading: spinner interno (`.btn__spinner`) sin cambiar layout.

### Inputs y Textareas (`ui/Input`, `ui/Textarea`)
- Usar `@include mix.input-compact()` en `&__control`.
- Estados:
  - `.is-invalid`: borde `--color-danger` + halo sutil.
  - `:disabled`: opacidad 0.6, cursor `not-allowed`.
- Labels (`&__label`) compactos y con color de texto primario.

### Formularios OrangeAlex (`common/forms/orangealex-form.scss`)
- Grid con `&__grid[--cols-3|--cols-4]` y `gap: var(--spacing-md)`.
- Header con borde inferior `2px` en `--color-primary`.
- Campos nativos (`input/select/textarea`) dentro del form usan `@include mix.input-compact()`.

### Tablas (`common/Entitytable`)
- Celdas compactas: `padding: var(--table-cell-py) 0.5rem`.
- Header con fondo `--table-header-bg` y texto `--table-header-fg`; uppercase sutil y sticky opcional.
- Hover-row suave; sin cambios de altura.
- Acciones por fila: usar `TableActionsCell` para evitar duplicación.

### Paginación (`common/Pagination`)
- Centrada con flex en `.entity-table__pagination`.
- Select “Filas por página” con `@include mix.input-compact()` y altura `--control-height-sm`.
- Botones compactos con borde `--surface-border` y hover naranja corporativo.

### Modales (`ui/Modal`) y Diálogos (`ui/ConfirmDialog`)
- Overlay: `--overlay-bg` y `--overlay-blur`, centrado con flex, `z-index: --z-modal`.
- Contenido: `background: var(--surface-bg)`, `border-radius: var(--border-radius-medium)`, `box-shadow: var(--box-shadow-md)`, `padding: var(--spacing-6)`.
- ConfirmDialog: título/mensaje con tokens y acciones al final con `gap: var(--spacing-sm)`.

### Overlays de carga (`ui/LoadingOverlay`, `common/ListLoading`)
- Centrado total (flex, column), `z-index: --z-modal`.
- `currentColor` para spinner; hereda color del contenedor (usar `--color-primary`).
- Mensaje con `--color-text-primary`.

## Buenas prácticas
- Encapsular estilos por componente; evitar depender de clases de otras pantallas.
- Usar tokens/mixins para colores, espaciamientos y focus; no hardcodear hex ni tamaños.
- Mantener paginación fuera del área scroll del body de la tabla y centrada.
- No cambiar contratos de componentes ni i18n; los textos van en `*.messages.ts`.

## QA visual (checklist rápido)
- Botones: altura/tamaños correctos; focus visible; hover coherente.
- Inputs/Textareas: altura ~36px; halo de foco; errores en rojo.
- Tablas: padding de celdas uniforme; hover sutil; sin scroll doble; paginación centrada.
- Modales/Diálogos: overlay por encima; padding y radios homogéneos; sombras sutiles.
- Overlays de carga: spinner centrado, color corporativo, mensaje legible.

## Ejemplos de importación
```
// En un SCSS de componente atómico
@use '../../styles/_mixins' as mix;
.mi-input { @include mix.input-compact(); }

// En un SCSS de componente común desde subcarpetas
@use '../../../styles/_mixins' as mix;
.mi-select { @include mix.input-compact(); }
```

## Roadmap sugerido (futuro)
- Documentar patrones de `SearchBar/CommandBar` y filtros dinámicos.
- Consolidar utilidades de layout (centrado, espacios) si aparecen repetidamente.
- Añadir ejemplos de accesibilidad (focus states, aria) en guía de componentes.

