Error handling guidelines

- Prefer `apiCall(fn, { where, toastOnError })` for async actions.
- Map messages via `mapAppErrorMessage`; avoid raw `toast.error` strings.
- Use `where` contexts like `auth.login`, `kanban.board.save`, `security.roles.update`.
- For UI actions with confirms, wrap handlers with `withApiCall`.
- Keep a single toast surface per action to avoid duplicates.

UI rules of thumb

- In containers and components: prefer `withApiCall(() => action(), { where, onOk })` to reduce try/catch boilerplate and centralize toasts.
- Success toasts are explicit (e.g., after login). Error toasts come from `apiCall/withApiCall` via `toastOnError: true` or default behavior.
- Close dialogs/forms only after `res.ok` or within `onOk`.

Lower layers

- Services should throw on error; do not toast. Use `apiCall` at call sites to normalize and handle.
- Hooks can either: (a) propagate errors and let containers toast, or (b) use `apiCall({ toastOnError: true })` internally—avoid both to prevent duplicates.

Patterns

- Queries/mutations: use service functions that throw; let hooks show errors via `useSafeMutation` or pass `toastOnError: true` to `apiCall` in containers.
- Global capture: unhandled errors are normalized and logged; rely on this for unexpected cases.

Examples

- Create Permission: `apiCall(() => create.mutateAsync(dto), { where: 'security.permissions.create', toastOnError: true })`
- Update Role: `apiCall(() => update.mutateAsync({ id, input }), { where: 'security.roles.update', toastOnError: true })`
- Delete Role with helper: `withApiCall(() => remove.mutateAsync(id), { where: 'security.roles.delete', onOk: closeModal })`

Contextos where recomendados

- auth.*
  - auth.login
  - auth.finalize
  - auth.logout
  - auth.session
  - auth.refresh
- kanban.board.*
  - kanban.board.fetch
  - kanban.board.save
- security.roles.*
  - security.roles.list
  - security.roles.create
  - security.roles.update
  - security.roles.delete
  - security.roles.form.submit
  - security.role_permissions.list
  - security.role_permissions.assign
- security.permissions.*
  - security.permissions.list
  - security.permissions.create
  - security.permissions.update
  - security.permissions.delete
  - security.permissions.form.submit
- security.users.*
  - security.users.list
  - security.users.create
  - security.users.update
  - security.users.delete
  - security.users.form.submit
  - security.user_roles.assign
- shell.menu.*
  - shell.menu.main
  - shell.menu.profile

Convenciones
- Formato: `<dominio>.<recurso>.<acción>`.
- Usar subrecursos cuando aplique (ej: `security.role_permissions.*`).
- Mantener consistencia entre containers, hooks y servicios.

Integración con errorService (prod)

- errorService soporta `setAdapter(adapter)` y `clearAdapter()` para enrutar errores a un colector (Sentry u otro).
- En dev: usar el `consoleAdapter` (no-op a servidor).
- En prod: inicializar el adapter en el bootstrap de la app (por ejemplo, `index.tsx` o `core/providers.tsx`).

Ejemplo

```
import errorService from '@/shared/api/errorService';
import { consoleAdapter } from '@/shared/api/errorAdapter';

if (import.meta.env.PROD) {
  // Inicializa tu adapter real aquí (Sentry, DataDog, etc.)
  // errorService.setAdapter(sentryAdapter)
} else {
  errorService.setAdapter(consoleAdapter);
}
```
