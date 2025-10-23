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
