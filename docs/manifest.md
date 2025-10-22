# Manifiesto de Arquitectura del Proyecto baseApp

Este documento es la fuente de verdad sobre los estándares de arquitectura, tecnologías y mejores prácticas del proyecto **baseApp**.  
Su cumplimiento es obligatorio para garantizar la calidad, escalabilidad y mantenibilidad del código.

---

## 1. Stack Tecnológico Principal

- **Framework:** React 18+ con TypeScript.
- **Bundler y Entorno:** Vite.
- **Gestión de Estado:**
  - **Servidor:** TanStack Query (React Query v5).
  - **Cliente Global:** Zustand (patrón de slices).
- **Estilos:** SCSS modular + BEM + sistema de diseño global.
- **Enrutamiento:** React Router v6.
- **Formularios:** React Hook Form + Zod.
- **Calidad:** ESLint + Prettier (con hooks y commitlint).
- **Pruebas:** Vitest + React Testing Library.
- **Mock API:** Mock Service Worker (MSW).
- **Documentación de Componentes:** Storybook.

---

## 2. Arquitectura: Feature-Sliced Design (FSD)

El código se organiza por funcionalidades de negocio, no por tipos técnicos.  
Estructura general:

```
src/
├── app/           → Providers, inicialización global, rutas
├── features/      → Módulos funcionales (auth, security, kanban…)
├── components/    → UI Kit (ui, common, form)
├── constants/     → Permisos, rutas, queryKeys
├── store/         → Zustand slices globales
├── styles/        → Base SCSS, mixins, variables
└── types/         → Tipos TypeScript compartidos
```

