## 🧱 3. Arquitectura General — FSD

La aplicación adopta el patrón **Feature-Sliced Design (FSD)**:  
el código se organiza por _funcionalidades de negocio_ y no por tipo técnico.  
Cada feature es un _módulo autocontenido_ con sus componentes, hooks, servicios, tipos y estilos.

### Estructura de alto nivel

src/
├── app/ → Providers globales, inicialización y rutas raíz
├── core/ → Integraciones de plataforma (queryClient, theme, errorBoundary)
├── features/ → Módulos funcionales (auth, security, kanban, products, etc.)
├── shared/ → Código transversal reutilizable (UI, hooks, utils, api)
├── constants/ → Rutas, permisos, mensajes comunes
├── styles/ → Variables, mixins y base SCSS
└── routes/ → AppRoutes y ProtectedRoute

yaml

---

### 3.1 Principios FSD

1. **Encapsulación:** cada feature controla su API pública mediante `index.ts`.
2. **Independencia:** los features no se importan entre sí, solo a través de sus barriles.
3. **Reutilización controlada:** `shared/` contiene únicamente piezas verdaderamente transversales.
4. **Documentación por feature:** cada módulo debe incluir su README o comentarios clave.

---

### 3.2 Ejemplo práctico

**Feature:** `security`  
Contiene permisos, usuarios y roles.

src/features/security/
├── api/ // Servicios HTTP, DTOs y mappers
├── components/ // Vistas y formularios
├── hooks/ // Hooks TanStack/Zustand del dominio
├── constants/ // PERMISSIONS, MENUS, etc.
├── types/ // DTOs, models, schemas Zod
└── index.ts // API pública

python

Uso en otro módulo:

````ts
import { UsersPage } from "@/features/security";
❌ Prohibido:

ts

import { UsersPage } from "@/features/security/components/UsersPage";
3.3 Fuentes de verdad
Permisos RBAC: src/features/security/constants/permissions.ts

Rutas de app: src/constants/routes.ts

Tipos de dominio: src/features/<feature>/types/

Mocks y roles demo: src/mocks/data/db.ts

Toda validación de permisos, rutas o datos parte de esas fuentes; ninguna constante se replica.

3.4 Beneficios
Facilita refactors parciales sin romper dependencias.

Permite lazy loading por feature.

Mejora el aislamiento para testing.

Reduce acoplamientos y duplicidad de código.

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
title: "Gestión de Estado y Hooks"
version: 1.0
status: active
last_sync: 2025-10-23
---
