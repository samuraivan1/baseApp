title: "Estructura de Carpetas y Módulos"
version: 1.0
status: active
last_sync: 2025-10-23
📁 4. Estructura de Carpetas y Módulos
Cada feature o capa debe mantener una jerarquía clara y reproducible.
Los nombres de carpetas usan kebab-case; los archivos de componentes usan PascalCase.

pgsql

src/
  features/
    auth/
      api/
      components/
      hooks/
      types/
      index.ts
    security/
      api/
      components/
      hooks/
      constants/
      types/
      index.ts
  shared/
    components/
      ui/
      common/
    hooks/
    api/
    types/
4.1 Carpetas obligatorias en un feature
Carpeta	Propósito
api/	servicios HTTP, DTOs, mappers
components/	componentes React del dominio
hooks/	lógica reutilizable o acceso a TanStack Query
types/	tipos, modelos, Zod schemas
constants/	permisos, mensajes, enums
index.ts	API pública del feature

4.2 Patrón de componentes (FSD)
Todo componente vive en una carpeta homónima con su código, SCSS e índice.

pgsql

/RolesTable
├── RolesTable.tsx
├── RolesTable.scss
└── index.ts
tsx

// RolesTable.tsx
import "./RolesTable.scss";
export const RolesTable = () => <div className="roles-table">...</div>;
Reglas:

El SCSS es modular y usa BEM (.roles-table__row--selected).

No se comparten estilos globales entre features.

Exportar solo desde index.ts.

4.3 Hooks
Prefijo use obligatorio (useRoles, useUsers).

Siempre al inicio del componente; nunca dentro de condicionales.

Los hooks de acceso a API usan TanStack Query con claves de src/constants/queryKeys.ts.

4.4 Stores (Zustand)
Cada slice vive en su propio archivo (authSlice.ts, menuSlice.ts).

El store principal los combina en src/app/store.ts.

Solo guardar estado de UI o sesión; los datos del backend van a React Query.

4.5 Ejemplo de feature completo
bash

features/
  kanban/
    api/tableroService.ts
    components/KanbanBoard/
      KanbanBoard.tsx
      KanbanBoard.scss
      index.ts
    hooks/useKanbanBoard.ts
    types/models.ts
    index.ts
Ventaja: el módulo es autónomo y portable; puede extraerse a un micro-frontend sin romper dependencias.




---



---
