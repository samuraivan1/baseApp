---
title: "Guía de Desarrollo Unificada — baseApp"
version: 1.0
status: active
last_sync: 2025-10-23
---

# Guía de Desarrollo Unificada — baseApp

## Manual técnico y pedagógico del ecosistema OrangeAlex

Esta guía consolida todos los estándares, metodologías y buenas prácticas que rigen el desarrollo del proyecto **baseApp**.  
Su objetivo es doble: servir como **referencia normativa** para arquitectos y auditores, y como **manual de incorporación** para nuevos desarrolladores.

---

### Filosofía general

baseApp es un ecosistema modular orientado a **calidad, escalabilidad y coherencia visual**.  
Todo su código sigue tres principios:

1. **Autonomía:** cada feature debe ser autocontenida y exportar su propia API pública.
2. **Trazabilidad:** todos los procesos (auth, API, permisos, errores, UI) deben poder auditarse.
3. **Consistencia:** las decisiones de diseño técnico y visual provienen del _Global Design System (GDS)_.

---

## 🧩 1. Introducción

baseApp nace como una aplicación empresarial basada en **React 18 + TypeScript**, pensada para ser el marco de trabajo oficial de soluciones internas y externas bajo la arquitectura OrangeAlex.  
Esta guía explica cómo estructurar, desarrollar, documentar y mantener código dentro del estándar corporativo.

Incluye convenciones de:

- Arquitectura (FSD — Feature-Sliced Design)
- Estado global (TanStack Query + Zustand)
- Estilos (SCSS modular + BEM + tokens CSS)
- Consumo de APIs (servicios + mappers + error handling)
- Seguridad (RBAC + ProtectedRoute + PermissionGate)
- Testing y CI/CD (Vitest + MSW + auditorías)

---

---

title: "Stack Tecnológico Principal"
version: 1.0
status: active
last_sync: 2025-10-23

---

## ⚙️ 2. Stack Tecnológico Principal

| Capa                      | Tecnología                      | Rol                                      |
| ------------------------- | ------------------------------- | ---------------------------------------- |
| **Framework UI**          | React 18 + TypeScript           | base SPA, tipado estricto                |
| **Bundler**               | Vite                            | build rápido y hot reload                |
| **Estado Servidor**       | TanStack Query v5               | caché, revalidación y sincronización API |
| **Estado Cliente Global** | Zustand (slices)                | estado de UI, sesión y menús             |
| **Formularios**           | React Hook Form + Zod           | validación tipada                        |
| **Estilos**               | SCSS modular + BEM + tokens CSS | coherencia visual                        |
| **Routing**               | React Router v6                 | navegación protegida y lazy loading      |
| **Mock API**              | MSW (Mock Service Worker)       | simulación de endpoints                  |
| **Pruebas**               | Vitest + React Testing Library  | unit + integración                       |
| **Documentación UI**      | Storybook                       | catálogo de componentes                  |
| **Calidad**               | ESLint + Prettier + commitlint  | estilo y normas de código                |

**Integraciones opcionales:** Redux Toolkit (store base híbrido), Sentry (error tracking), DataDog (logging de producción).

---

### Principios de stack

- **Todo es tipado:** ninguna operación puede usar `any`.
- **Un solo cliente HTTP:** `src/shared/api/apiClient.ts`.
- **Mocks obligatorios en desarrollo:** no se hace fetch directo al backend.
- **Capa de errores unificada:** `errorService` + `AppError`.
- **Internacionalización por mensajes:** sin textos literales en JSX.

---

---

title: "Arquitectura General — Feature-Sliced Design (FSD)"
version: 1.0
status: active
last_sync: 2025-10-23

---

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
Copiar código

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
Copiar código

Uso en otro módulo:

```ts
import { UsersPage } from "@/features/security";
❌ Prohibido:

ts
Copiar código
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
Copiar código
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
Copiar código
/RolesTable
├── RolesTable.tsx
├── RolesTable.scss
└── index.ts
tsx
Copiar código
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
Copiar código
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
```
