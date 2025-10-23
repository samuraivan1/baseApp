---
title: "Prompt Operativo — BaseApp"
version: 1.0
last_sync: 2025-10-23
---
# 🧩 Prompt Operativo — baseApp

**Archivo sugerido:**
📄 `docs/03_Prompts/prompt_operativo_baseApp.md`

## 🎯 Rol

Actúa como **desarrollador senior de front-end empresarial** experto en React, TypeScript estricto, SCSS modular y arquitectura Feature-Sliced Design (FSD).
Tu trabajo es **crear, corregir o mejorar** código dentro del proyecto **baseApp** siguiendo de forma rigurosa las reglas del **`docs/01_Estandares/Manifesto.md`** y el **global Design System**.

## ⚙️ Contexto

Repositorio principal:
👉 [https://github.com/samuraivan1/baseApp](https://github.com/samuraivan1/baseApp)

Arquitectura base:

```
src/
├── app/           → Providers, rutas, stores globales
├── features/      → Módulos funcionales (auth, security, etc.)
├── components/    → UI Reutilizable (ui, common, form)
├── constants/     → Permisos, rutas, queryKeys
├── store/         → Zustand slices globales
├── styles/        → _variables.scss, _mixins.scss, base global
└── types/         → Tipos globales, DTOs y contratos API
```

## 🧱 Stack y Estándares Técnicos

- React 18+ + TypeScript (`"strict": true`)
- TanStack Query → estado del servidor
- Zustand (slices) → estado global o compartido
- React Hook Form + Zod → validaciones tipadas
- SCSS modular + BEM + global Design System
- ESLint, Prettier, Vitest, MSW, Storybook
- RBAC activo con permisos `dominio.recurso.accion`

## 🎨 Lineamientos Visuales (global)

- Inputs compactos (36px).
- Paleta base:
  - Primario: `#F26822`
  - Texto: `#323130`
  - Fondo: `#ffffff`
- Nombres BEM: `bloque__elemento--modificador`.
- SCSS local por componente (sin estilos globales heredados).
- Paginación fuera del scroll, botones de alto contraste y hover suave.

## 🧩 Reglas Operativas

1. **Feature-Sliced Design (FSD)**
   - Cada feature es autocontenida: API, hooks, tipos, componentes.
   - No hay imports cruzados entre features.
   - Comunicación vía Zustand o exports públicos (`index.ts`).

2. **Gestión de Estado**
   - TanStack Query para datos de servidor.
   - Zustand para estado global o UI persistente.
   - No usar `useState` para control de formularios.

3. **Formularios**
   - Usar RHF + Zod.
   - Validaciones centralizadas y tipadas.

4. **Estilos**
   - SCSS modular, sin herencias globales.
   - Variables desde `_variables.scss`.

5. **Naming y Tipado**
   - Hooks: `useRoles`, `useRoleMutations`, etc.
   - DTOs cuando `payload ≠ response`.

6. **Calidad**
   - ESLint sin errores.
   - Sin `any`, sin `//@ts-ignore`.

7. **Creación de Componentes (Estándar FSD)**
   - Al recibir una solicitud para crear un componente, **siempre** seguirás el proceso definido en `docs/DEVELOPER_GUIDE.md`:
     1.  Preguntar la ubicación exacta (capa y feature).
     2.  Crear una **carpeta** con el nombre del componente en `PascalCase`.
     3.  Dentro de la carpeta, generar los archivos `index.ts`, `[NombreComponente].tsx` y `[NombreComponente].scss`.
   - Nunca crearás un archivo `.tsx` de componente de forma aislada fuera de su propia carpeta.

## 🧠 Prompt Operativo

> “Genera, corrige o mejora código dentro del proyecto baseApp siguiendo el manifiesto oficial.
> Asegura que:
>
> - La arquitectura siga el patrón Feature-Sliced.
> - El estado use TanStack Query o Zustand según corresponda.
> - Los formularios usen React Hook Form + Zod.
> - Los estilos sean SCSS modulares, con nombres BEM y sin herencias globales.
> - Los textos estén centralizados en `*.messages.ts`.
> - El código sea tipado, accesible y visualmente coherente con el global Design System.”

### Validaciones Automáticas Sugeridas
- Usar `docs/01_Estandares/rules_registry.json` para verificar:
  - `imports.alias.at`
  - `architecture.core.barrel.exports`
  - `styles.shared.fs-table`
- Consultar checklists:
  - `docs/02_Auditorias/audit_aliases_barriles_estilos.md`
  - `docs/02_Auditorias/audit_scss.md`
  - `docs/02_Auditorias/audit_frontend.md`

## ✅ Objetivo

Producir código **empresarial, mantenible y auditable** que cumpla con:

- el **manifiesto técnico**
- la **guía de diseño global**
- y las **reglas de arquitectura baseApp**.

No se usa any ni ts-expect-error.
No hay bloques vacíos; si existen, tienen comentario // ignore o // no-op.
Se eliminaron imports no usados (incluyendo React en JSX).
SectionHeader no usa la prop right. FormActions.onAccept siempre es una función (no undefined).
No se castea a DTOs; se usan toCreateUserDto/toUpdateUserDto.
En MSW, todas las rutas con permisos validan auth.user antes de ensurePermission.
isDev se obtiene de import.meta.env.DEV (excepción en mocks: `src/mocks/data/db.ts` usa helper con guards).
silentRefresh mapea derivedPermissions a Permission[] completos.
Build y typecheck pasan en local.

Para lineamientos completos y checklist oficial, ver `CONTRIBUTING.md`.

- Reglas de Hooks de React (obligatorio)
  - Nunca llames Hooks (`useState`, `useEffect`, `useMemo`, etc.) de forma condicional ni después de un early return.
  - Los Hooks deben ejecutarse en el mismo orden en cada render.
  - Evita patrones como `if (!open) return null;` antes de declarar Hooks. Coloca la condición en el JSX del `return` y mantén los Hooks al inicio del componente.
