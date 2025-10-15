Perfecto, pauso las fases y hago una auditoría enfocada en atomicidad y portabilidad de componentes, siguiendo FSD y OrangeAlex DS.
Criterios usados
• Atomicidad: cada componente encapsula su lógica, estilos, mensajes y tipos; no depende de variables externas ad hoc.
• Portabilidad: un componente debe poder moverse a otra app sin romper por dependencias implícitas o acoplamientos (stores globales, rutas internas, strings sueltos).
• FSD: los componentes públicos de una feature se exponen vía su index.ts; no importan internals de otras features.
• DS: props claras, tipadas, sin any, sin acceder a stores globales directamente; side-effects mínimos.
Hallazgos por áreas
Shell
• useMainMenu (src/features/shell/components/ResponsiveAppBar/hooks/useMainMenu.ts)
• Bien: filtra permisos vía prop de store (hasPermission). Normaliza menú con Zod canónico (nuevo).
• Riesgo: acoplamiento directo a useAuthStore (estado global) dentro del hook. Portabilidad limitada.
• Mejora: exponer una variante pura useMainMenuBase(items, hasPermission) y un tiny wrapper que inyecte store. Así portabilidad + testabilidad.
• Header y Layout (src/features/shell/components/Header/index.tsx, src/features/shell/Layout/index.tsx)
• Header lee estado global de auth; no es portable per se.
• Mejora: que Header acepte props derivadas (phase, isLoggedIn) y el contenedor las provea; actual impl es contenedor+presentational en el mismo.
• PermissionGate (src/shared/components/PermissionGate)
• Bien: encapsula lógica de permisos via prop mode y callback hasPermission del store. Mantiene atomicidad si recibe props puras.
• Asegurar que no accede a store directo; si lo hace, refactor a prop-driven.
Auth
• LoginPage (src/features/auth/components/index.tsx)
• Accede a useAuthStore y postLoginFinalize; está bien como “container component”.
• Mejora: separar componente presentacional LoginForm (sin store) + contenedor que entrega onSubmit y estados. Hará portable la UI.
Kanban
• Column y Task (src/features/kanban/components/components/...)
• Bien: usan props puras (column, tasks, task). Drag n’ drop local.
• Mejora: Column calcula permiso con usePermissionsCrud (acoplamiento a feature Security). Riesgo en portabilidad.
• Solución: pasar canCreateTask como prop o un callback de permiso desde arriba. Mantener Column presentacional y portable.
• Kanban/index.tsx
• Container claro: orquesta DnD, store board, y persistencia. No debe ser portable (y está bien que no lo sea).
• Mejora: aislar pequeñas funciones puras (findColumnOfTask) en helpers testables.
Shared
• SafeLink, SafeImg, SafeHtml, SearchBar, EntityTable, CommandBar
• Por lo general buenos, props-driven. Revisar:
• CommandBar/index.tsx: tiene tipos internos y filtros, confirmar que no use stores globales. Si recibe handlers vía props, está ok.
• EntityTable: tipado genérico T extends object correcto; verificar que estilos y mensajes estén en archivos locales (_.messages.ts). Evitar strings inline.
Security
• Form components (RoleForm, PermissionForm)
• Usan RHF con tipos internos; bien.
• Mejora: mover textos a _.messages.ts si hay strings inline. Asegurar separación DTO/UI (ya ok).
Otras notas
• Mensajes/textos: varios strings están embebidos en componentes (LoginPage.messages ya existe; Kanban también). Mantener patrón: todos los textos en _.messages.ts por componente o feature.
• Estilos: seguir colocación de estilos en la carpeta del componente. Evitar estilos globales no necesarios.
• Tipos: ya sin any. Mantener props tipadas y no depender de shapes globales indirectamente.
Recomendaciones concretas
Alta prioridad (sin romper funcionalidad)
• Separar presentacional vs contenedor:
• LoginPage: extraer LoginForm (presentacional) que recibe onSubmit, isSubmitting y mensajes.
• Header: aceptar phase/isLoggedIn como props; el contenedor Layout los pasa.
• Column: aceptar canCreateTask como prop, no calcular permisos adentro.
• Hooks puros + wrappers:
• useMainMenu: extraer useMainMenuBase(items, hasPermission) y mantener wrapper con store. Esto mejora portabilidad y tests.
• Mensajes:
• Revisar componentes por strings inline y mover a _.messages.ts (Header, Column, Task ya tienen messages; confirmar en CommandBar y EntityTable).
• Public API:
• Asegurar que los componentes “presentacionales” se exportan desde index.ts de su feature y que no importan stores directamente.
Media prioridad
• CommandBar y EntityTable:
• Confirmar que no dependen de rutas/stores. Si hay algo acoplado, pasarlo vía props.
• Normalización de menú en servicio:
• Mover la validación Zod a fetchMenu o a un adapter para que el hook reciba datos ya canónicos. Hook permanece puro sobre datos validados.
Baja prioridad
• Storybook/Ladle:
• Añadir historias para los presentacionales extraídos (LoginForm, Column, Task) con knobs mínimos.
• A11y:
• Revisar aria-labels, roles y focus states; especialmente en CommandBar, EntityTable, y los botones de Kanban.
¿Quieres que aplique ahora las refactorizaciones de alta prioridad para reforzar atomicidad y portabilidad en:
• LoginPage → LoginForm presentacional,
• Header → props-driven,
• Column → canCreateTask por prop,
• useMainMenu → extraer variante base sin store,y actualice los \*.messages.ts donde falten?
si p

A) Revisar contexts where e internacionalización de mensajes de error por dominio (tabla de contexts en docs).
B) Añadir errorService.setAdapter pluggable para envío a collector en prod (no-op en dev).
C) Integrar ErrorBoundary mejorado con botón “Recargar” y, en dev, “Limpiar cache de React Query”.
D) Pasada final para Auth refresh/logout y rutas protegidas para asegurar consistencia de errores y redirecciones.
