## ⚠️ 10. Manejo de Errores, Logging y Mensajes

El manejo de errores en baseApp busca **consistencia**, **visibilidad** y **no duplicación de mensajes**.  
Todas las excepciones se capturan y normalizan a través de utilidades comunes.

---

### 10.1 Flujo de errores

1. El servicio lanza `AppError` mediante `handleApiError()`.
2. Los hooks usan `apiCall` o `useSafeMutation` para envolver la llamada.
3. La UI muestra el resultado mediante `toast` o `ErrorBoundary`.

---

### 10.2 Ejemplo

```ts
const result = await apiCall(() => userService.createUser(dto), {
  where: "security.users.create",
  toastOnError: true,
});

if (result.ok) toast.success("Usuario creado correctamente");
El where identifica la operación y ayuda al logger y al auditor.

10.3 errorService
Centraliza la lógica de logging.
Permite configurar adaptadores (console, sentry, datadog).

ts

import errorService from "@/shared/api/errorService";
import { consoleAdapter } from "@/shared/api/errorAdapter";

if (import.meta.env.DEV) errorService.setAdapter(consoleAdapter);
10.4 Mensajes centralizados
Ningún texto visible debe estar en JSX.
Cada componente usa su archivo .messages.ts.

Ejemplo:

ts

export const roleMessages = {
  title: "Gestión de Roles",
  createSuccess: "Rol creado correctamente",
  deleteConfirm: "¿Deseas eliminar este rol?",
};
title: "Testing, QA y Auditoría"
version: 1.0
status: active
last_sync: 2025-10-23
🧪 11. Testing, QA y Auditoría
El sistema de calidad de baseApp se apoya en Vitest, React Testing Library y MSW.
Las pruebas se dividen por tipo y profundidad.

11.1 Pruebas unitarias
Para funciones puras y utilidades (utils, mappers).

Se ubican junto al código (*.test.ts).

Deben probar entradas y salidas, no implementaciones internas.

11.2 Pruebas de integración
Para hooks (useUsers, useRoles).

Se testean con MSW activado (mockServiceWorker.start()).

11.3 Pruebas de componentes
Usar React Testing Library (render, fireEvent, screen).

Evitar snapshots extensos.

Validar comportamiento, no estilos.

11.4 Auditorías automáticas
Scripts en CI validan:

npm run lint:ci

npm run test -- --coverage

npm run type-check

Los reportes se guardan en /docs/02_Auditorias/.

11.5 QA manual
Revisar accesibilidad (roles, labels, foco).

Validar flujo completo con mocks MSW.

Documentar incidentes en /docs/04_Logs/.

title: "Naming, Tipado y DTOs"
version: 1.0
status: active
last_sync: 2025-10-23
🧩 12. Naming, Tipado y DTOs
Un código legible y mantenible empieza con un buen naming y tipado estricto.

12.1 Convenciones
Tipo	Convención	Ejemplo
Componentes	PascalCase	UserForm.tsx
Hooks	camelCase con use	useAuthStore.ts
Interfaces	Prefijo I	IUser, IRole
DTOs	Sufijo DTO	UserResponseDTO
Enums	Prefijo E	ERoleType
Constantes	CONSTANT_CASE	API_BASE_URL
Archivos	snake_case o kebab-case	user_service.ts, form-actions.scss

12.2 Tipado estricto
"strict": true en tsconfig.json.

Prohibido any o unknown sin narrowing.

En servicios: ApiResponse<T> y PaginatedResponse<T>.

ts

export type ApiResponse<T> = {
  data: T;
  message?: string;
  status: string;
};
12.3 Mappers y modelos
Diferenciar DTO (contrato API) del modelo de dominio:

ts

export interface IUser { id: number; name: string; }

export interface UserResponseDTO { user_id: number; user_name: string; }

export const toUser = (dto: UserResponseDTO): IUser => ({
  id: dto.user_id,
  name: dto.user_name,
});
12.4 Schemas Zod
Ubicar en types/schemas.*.ts y exportar desde types/index.ts.

title: "Buenas Prácticas y Estilo de Código"
version: 1.0
status: active
last_sync: 2025-10-23
🧠 13. Buenas Prácticas y Estilo de Código
baseApp adopta un conjunto estricto de reglas para mantener un código limpio y coherente.

13.1 Reglas esenciales
Sin any, @ts-ignore o bloques vacíos.

Hooks siempre en orden.

Imports sin uso prohibidos.

Condicionales en JSX, no en lógica de hooks.

apiClient único y centralizado.

fetch y axios directos prohibidos.

No repetir lógica de error o toasts.

Textos en .messages.ts, no hardcodeados.

13.2 Ejemplo de patrón correcto
tsx

const handleCreate = async () => {
  const res = await apiCall(() => roleService.create(dto), {
    where: "security.roles.create",
    toastOnError: true,
  });
  if (res.ok) showToastSuccess("Rol creado");
};
13.3 Estilo SCSS
Un archivo por componente.

Variables globales (@use '@/styles/variables').

BEM para nombres.

No valores mágicos.

13.4 ESLint y Prettier
Reglas obligatorias: import/order, react-hooks/exhaustive-deps, no-unused-vars.

Ejecutar npm run lint antes de cualquier commit.

Formateo automático al guardar.

title: "Contribución y Pull Requests"
version: 1.0
status: active
last_sync: 2025-10-23
🤝 14. Contribución y Pull Requests
Cada desarrollador debe seguir el flujo oficial de colaboración.

14.1 Branches
feature\* para nuevas funcionalidades.

fix\* para correcciones.

refactor\* para mejoras sin cambio funcional.

14.2 Commits
Seguir Conventional Commits:

feat: → nueva funcionalidad

fix: → corrección de bug

refactor: → cambio interno

docs: → documentación

test: → pruebas

Ejemplo:

scss

feat(security): agregar creación de roles
14.3 PRs
Descripción clara y concisa.

Adjuntar capturas de UI si aplica.

Referenciar issues o tareas.

Pasar linters, tests y build antes del merge.

14.4 Documentación
Cada cambio que afecte reglas o APIs debe actualizar su sección en la guía o el manifiesto.

title: "CI/CD, Control de Calidad y Auditorías"
version: 1.0
status: active
last_sync: 2025-10-23
🧮 15. CI/CD, Control de Calidad y Auditorías
Los pipelines aseguran que todo cambio cumpla los estándares técnicos.

15.1 Lint y tests automáticos
GitHub Actions ejecuta:

yaml

- run: npm ci
- run: npm run lint:ci
- run: npm run test -- --coverage
- run: npm run type-check
15.2 Auditorías automáticas
Resultados en docs/02_Auditorias/:

audit_frontend.md

audit_scss.md

audit_aliases_barriles_estilos.md

15.3 Reglas de aprobación
Cobertura mínima: 80%.

Linter sin errores.

Build exitoso.

Documentación actualizada (status: active).

15.4 Pipeline de release
main → build de producción.

Versionado SemVer (1.2.3).

Deploy automático a entorno interno.

title: "Cierre y Visión a Futuro"
version: 1.0
status: active
last_sync: 2025-10-23
🚀 16. Cierre y Visión a Futuro
baseApp es más que una aplicación: es el framework corporativo de referencia para desarrollo frontend empresarial.

Objetivos de evolución
Integrar adaptadores a SAP S/4HANA (EWM/TMS/LMS).

Mejorar trazabilidad de auditoría interna.

Extender el Global Design System con temas claros/oscuro.

Incorporar pruebas E2E automatizadas con Playwright.

Exponer un CLI interno para scaffolding de features.

Misión del estándar
Mantener un ecosistema:

Modular

Tipado

Seguro

Auditable

Estéticamente coherente

Este documento es vinculante.
Todo nuevo código, contribución o cambio en baseApp debe alinearse a este estándar técnico y visual.

Fin del documento — Guía de Desarrollo Unificada baseApp v1.0

yaml


---

```
