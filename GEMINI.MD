# Guía de Desarrollo Asistida por IA (GEMINI.MD)

Este documento es una guía técnica viva que refleja los estándares y la arquitectura de este proyecto. Ha sido generado a partir del análisis del código base y sirve como referencia para mantener la coherencia, la calidad y la escalabilidad.

Tanto los desarrolladores como los asistentes de IA deben seguir estas directrices al escribir o modificar código.

## 1. Principios Fundamentales

### 1.1. Arquitectura Orientada a Features (Feature-Oriented)

El código se organiza por dominios de negocio, no por tipo de archivo.

- **Do**: Toda la lógica de un dominio (ej. `security`, `kanban`) debe residir en su propia carpeta dentro de `src/features/`.
- **Do**: Cada feature debe exponer una API pública a través de su `index.ts` (barrel file). Los componentes, hooks o servicios que no se exportan desde aquí se consideran privados del feature.
- **Don't**: Nunca importes archivos internos de otro feature directamente (ej. `import ... from '@/features/security/components/...'`). Usa siempre la API pública (`import ... from '@/features/security'`).
- **Do**: Los componentes, hooks y utilidades verdaderamente genéricos y reutilizables deben ubicarse en `src/shared/`.

### 1.2. Gestión de Estado Especializada

Separamos estrictamente el estado del servidor del estado del cliente para optimizar el rendimiento y la predictibilidad.

#### Estado del Servidor (Remote State)

- **Do**: Usa **TanStack Query (React Query)** para todas las operaciones de datos del servidor (CRUD).
- **Do**: Encapsula la lógica de React Query en hooks personalizados por entidad (ej. `useUsersCrud`, `useRolesCrud`). Estos hooks deben abstraer las llamadas a la API y la gestión de caché.
- **Don't**: No uses stores de cliente (Zustand) para almacenar en caché los datos del servidor. React Query es la única fuente de verdad para los datos remotos.

#### Estado del Cliente (Client State)

- **Do**: Usa **Zustand** para el estado global de la UI que no persiste en el servidor.
- **Ejemplos**: Sesión de usuario (`useAuthStore`), estado del sidebar (`useSidebarStore`), temas de UI, etc.
- **Do**: El store de autenticación (`useAuthStore`) es la fuente de verdad para los roles y permisos del usuario actual.

### 1.3. Seguridad Basada en Roles (RBAC)

El control de acceso es una parte central de la aplicación y sigue un patrón estandarizado.

- **Do**: Define todos los permisos como constantes en `src/features/security/constants/permissions.ts`.
- **Do**: Sigue la nomenclatura `dominio.recurso.accion` (ej. `security.users.create`).
- **Do**: Utiliza el componente `<PermissionGate />` para mostrar/ocultar elementos de la UI de forma declarativa.
- **Do**: Utiliza el componente `<ProtectedRoute />` para proteger rutas completas.
- **Do**: Para lógica imperativa, usa los helpers del store de autenticación: `useAuthStore.getState().hasPermission(...)`.

## 2. Capa de API y Manejo de Errores

La comunicación con el backend es consistente y resiliente.

- **Do**: Realiza todas las peticiones HTTP a través del cliente `axios` centralizado en `src/shared/api/apiClient.ts`.
- **Do**: El `apiClient` ya gestiona la inyección de tokens `Authorization` (JWT), la protección `CSRF` y el refresco de sesión automático. No implementes esta lógica en otro lugar.
- **Do**: Para las mutaciones (POST, PUT, DELETE), utiliza el hook `useSafeMutation`. Este hook muestra automáticamente un "toast" de error al usuario, garantizando un feedback consistente.
- **Do**: Define Data Transfer Objects (DTOs) en `features/<feature>/types/dto.ts` para tipar los payloads de las APIs, separando los modelos de la base de datos de los datos que se transfieren.

## 3. Tipado y Validación

La seguridad de tipos es una prioridad.

- **Don't**: Evita el uso de `any` explícito o implícito. El `tsconfig.json` está configurado para detectar `any` implícitos.
- **Do**: Define todos los modelos de datos (interfaces, tipos) en `features/<feature>/types/models.ts`.
- **Do**: Utiliza `zod` para definir esquemas de validación de formularios en archivos separados (ej. `validationSchema.ts`). Esto mantiene la validación desacoplada de los tipos del modelo.
- **Do**: Al recibir datos de una API (ej. `request.json()`), realiza una aserción de tipo explícita para convertir el `any` implícito a un tipo conocido.

  ```typescript
  // Mal
  const body = await request.json();
  const row = { ...body };

  // Bien
  const body = await request.json() as Partial<User>;
  const row: User = { /* ... */, ...body } as User;
  ```

## 4. Mocking de API con MSW

El desarrollo y las pruebas se realizan de forma aislada del backend real.

- **Do**: Añade nuevos endpoints de mock en `src/mocks/handlers/`. Organiza los handlers por recurso (ej. `users.ts`, `roles.ts`).
- **Do**: El archivo `src/mocks/data/db.ts` es el punto de entrada para la "base de datos" en memoria. La lógica de seeding dinámico (como la asignación de permisos a roles) debe ir aquí.
- **Do**: Para endpoints CRUD, considera usar o extender los `genericHandlers` para reducir código duplicado. Si un endpoint requiere lógica específica (como validación de permisos), crea un handler dedicado.
- **Don't**: No modifiques `db.json` directamente para datos que se generan dinámicamente. Usa `db.ts` para aplicar esa lógica al iniciar.

## 5. Estilos e Internacionalización (i18n)

### Estilos (SCSS)

- **Do**: Cada componente o página debe tener su propio archivo `.scss` para mantener los estilos encapsulados.
- **Do**: Utiliza las variables y mixins definidos en `src/shared/styles/` para mantener la consistencia visual.
- **Don't**: No escribas selectores globales o de alto nivel que puedan afectar a otros componentes de forma no intencionada.

### Textos (i18n)

- **Don't**: Nunca escribas textos visibles por el usuario (labels, títulos, botones) directamente en el JSX.
- **Do**: Centraliza todos los textos en archivos `*.messages.ts` por componente o feature.
- **Do**: Sigue la convención de claves `scope.section.key` (ej. `users.form.email`).

## 6. Oportunidades de Refactorización (Guía para Mejoras)

El código base es sólido, pero siempre hay espacio para mejorar.

1.  **Refactorizar Handlers de Mock**: Los archivos en `src/mocks/handlers/` (como `users.ts`, `roles.ts`, `permissions.ts`) contienen lógica CRUD muy repetitiva.
    - **Acción**: Crear una factoría o un builder `createCrudHandlers(...)` que genere los 5 endpoints (GET all, GET one, POST, PUT, DELETE) a partir de una configuración simple (nombre de la tabla, campo ID, permisos requeridos). Esto reducirá drásticamente la duplicación.

2.  **Tipado Fuerte en Componentes**: Componentes como `Users/index.tsx` usan aserciones de tipo `(u as any)` y un `UserView` intermedio.
    - **Acción**: Refactorizar para usar los tipos del modelo (`User`, `Role`) directamente. Crear selectores o helpers si es necesario para transformar los datos, pero evitar el `any` y los modelos de vista intermedios si no son estrictamente necesarios.

3.  **Abstracción de Lógica de Paginación y Filtrado**: La lógica de filtrado, búsqueda y paginación en `Users/index.tsx` y `Permissions/index.tsx` es muy similar.
    - **Acción**: Crear un hook genérico `usePaginatedFilteredData({ data, columns, ... })` que encapsule esta lógica y devuelva los datos filtrados, el estado de la paginación y los manejadores de eventos.

Al seguir estas directrices, aseguramos que el proyecto siga siendo fácil de mantener, escalar y mejorar con el tiempo.
