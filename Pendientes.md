# REPORTE de Tipos – baseApp

## Inventario preliminar
(archivo|linea|declaracion)

src/routes/ProtectedRoute.tsx|5|interface ProtectedRouteProps {
src/i18n/types.ts|1|export type CommonMessages = {
src/i18n/types.ts|19|export type ScreenActions = {
src/i18n/types.ts|29|export type ScreenMessages = {
src/i18n/commonMessages.ts|1|export type CommonMessages = {
src/dev/exposeAuth.ts|5|  interface Window {
src/core/providers.tsx|12|type Theme = {
src/core/providers.tsx|27|type CoreStore = EnhancedStore;
src/core/providers.tsx|29|type CoreProvidersProps = {
src/app/store.ts|13|export type RootState = ReturnType<typeof store.getState>;
src/app/store.ts|14|export type AppDispatch = typeof store.dispatch;
src/shared/api/configService.ts|2|interface AppConfig {
src/shared/api/authService.ts|5|export type RefreshResponse = {
src/shared/api/authService.ts|11|export interface LoginCredentials {
src/shared/api/authService.ts|15|export interface LoginResponse {
src/mocks/handlers/auth.ts|5|type LoginBody = { username?: string; email?: string; password: string };
src/shared/api/errorService.ts|9|type NormalizedError = {
src/shared/api/errorService.ts|20|type Breadcrumb = {
src/shared/api/errorService.ts|26|type ErrorAdapter = {
src/shared/api/errorService.ts|188|export interface AppError {
src/shared/hooks/useSafeMutation.ts|1|import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query';
src/mocks/handlers/crudFactory.ts|8|interface CrudFactoryConfig<T extends ZodType> {
src/shared/hooks/useApiError.ts|5|type HandledError = {
src/mocks/handlers/tablero.ts|1|import { http, HttpResponse, type HttpHandler } from 'msw';
src/shared/components/common/DetailDrawer/index.tsx|4|export type DetailField<T> = {
src/shared/components/common/DetailDrawer/index.tsx|10|type DetailDrawerProps<T> = {
src/shared/security/url.ts|1|export type SafeUrlOptions = {
src/shared/components/common/ListLoading/index.tsx|5|export type ListLoadingProps = {
src/mocks/handlers/relations.ts|1|import { http, HttpResponse, type HttpHandler } from 'msw';
src/mocks/data/db.ts|11|type SeedShape = typeof seed;
src/mocks/data/db.ts|12|type DbShape = Omit<
src/mocks/data/db.ts|23|export type TableName = keyof DbShape;
src/shared/components/common/SafeImg/index.tsx|4|type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
src/mocks/handlers/generic.ts|6|type DbRow = Record<string, unknown>;
src/mocks/handlers/generic.ts|7|type DbCollection = DbRow[];
src/shared/components/common/FormActions.tsx|6|type FormActionsProps = {
src/shared/components/common/SafeLink/index.tsx|4|type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
src/features/products/api/productService.ts|4|export type Product = {
src/features/products/api/productService.ts|11|export type ProductInput = Omit<Product, 'product_id'>;
src/mocks/handlers/menu.ts|1|import { http, HttpResponse, type HttpHandler } from 'msw';
src/mocks/handlers/menu.ts|7|type LegacyMenuItem = {
src/features/sidebar/store.ts|3|type SidebarState = {
src/shared/components/common/CommandBar/types.ts|1|export interface FilterableColumn {
src/mocks/utils/auth.ts|11|export type AuthedUser = { user: { user_id: number; username?: string; correo?: string } | undefined; token: string };
src/features/products/api/hooks/useProductsCrud.ts|1|import { useEntityCrud, type EntityService } from '@/features/security/api/hooks/useEntityCrud';
src/shared/components/common/CommandBar/index.tsx|10|interface CommandBarProps {
src/shared/components/common/CommandBar/index.tsx|61|  type Filter = { id: string; field: string; value: string };
src/shared/components/common/PaginatedEntityTable/index.tsx|5|export type PaginationConfig = {
src/shared/components/common/PaginatedEntityTable/index.tsx|13|export type PaginatedEntityTableProps<T extends Record<string, unknown>> = {
src/shared/components/common/forms/inputs/FormInput.tsx|4|type BaseProps = React.InputHTMLAttributes<HTMLInputElement> & {
src/shared/components/common/PageHeader/index.tsx|7|interface Props {
src/shared/components/form/FormSection/index.tsx|6|export type FormSectionProps = {
src/shared/components/common/SafeHtml/index.tsx|1|import { useMemo, type HTMLAttributes } from 'react';
src/shared/components/common/SafeHtml/index.tsx|4|type SafeHtmlProps = {
src/shared/components/common/forms/inputs/FormSelect.tsx|4|type BaseProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
src/features/kanban/components/types.ts|2|export type TaskType = ApiTareaType;
src/shared/components/common/Entitytable/index.tsx|6|export interface EntityTableColumn<T extends object> {
src/shared/components/common/Entitytable/index.tsx|15|export interface EntityTablePaginationProps {
src/shared/components/common/Entitytable/index.tsx|23|export interface EntityTableProps<T extends object> {
src/shared/components/common/Entitytable/index.tsx|46|type CSSVars = CSSProperties & { ['--table-max-width']?: string };
src/features/kanban/types/models.ts|1|export interface TareaType {
src/features/kanban/types/models.ts|9|export interface ColumnaType {
src/features/kanban/types/models.ts|15|export interface TableroType {
src/shared/components/common/forms/inputs/FormTextarea.tsx|4|type BaseProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
src/shared/components/PermissionGate/index.tsx|4|interface PermissionGateProps {
src/shared/components/ui/Modal/index.tsx|4|type ModalProps = {
src/features/kanban/components/components/Task/index.tsx|8|interface TaskProps {
src/shared/components/ui/LoadingOverlay/index.tsx|4|export type LoadingOverlayProps = {
src/shared/components/ui/ConfirmDialog/index.tsx|6|export type ConfirmDialogProps = {
src/shared/components/ui/Textarea/index.tsx|5|type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
src/shared/components/common/SectionHeader/index.tsx|7|type Props = {
src/shared/components/common/TableActionsCell/index.tsx|5|export type TableActionsCellProps = {
src/shared/components/ui/Button/Button.stories.tsx|15|type Story = StoryObj<typeof Button>;
src/shared/components/ui/Button/index.tsx|7|type ButtonProps = {
src/shared/components/common/SearchBar/index.tsx|4|export type SearchBarProps = {
src/shared/components/ui/Input/index.tsx|5|type Props = React.InputHTMLAttributes<HTMLInputElement> & {
src/shared/components/ErrorBoundary/index.tsx|7|type Props = { children: React.ReactNode };
src/shared/components/ErrorBoundary/index.tsx|9|type State = {
src/shared/components/ui/Spinner/Spinner.tsx|3|export type SpinnerProps = {
src/features/kanban/components/components/Column/index.tsx|9|interface ColumnProps {
src/features/kanban/components/components/Column/index.tsx|21|  type Perm = { key?: string; permission_key?: string; name?: string };
src/shared/components/common/Pagination/index.tsx|5|interface PaginationProps {
src/features/shell/components/ResponsiveAppBar/hooks/useMainMenu.ts|11|type MenuItemWithPerm = NavMenuItem & {
src/features/shell/components/ResponsiveAppBar/UserProfileMenu.tsx|81|type UserProfileMenuProps = {
src/features/shell/components/ResponsiveAppBar/CustomNavMenu.tsx|10|interface MenuItemProps {
src/features/shell/components/ResponsiveAppBar/CustomNavMenu.tsx|14|interface CustomNavMenuProps {
src/features/shell/state/store.types.ts|6|export interface AuthState {
src/features/shell/state/store.types.ts|14|export interface AuthActions {
src/features/shell/state/store.types.ts|30|export type AuthStoreType = AuthState & AuthActions;
src/features/shell/state/store.types.ts|33|export type BoardState = TableroType;
src/features/shell/state/store.types.ts|35|export interface BoardActions {
src/features/shell/types/models.ts|1|export interface NavMenuItemBase {
src/features/shell/types/models.ts|13|export type NavMenuItem =
src/features/auth/slice.ts|3|type AuthState = {
src/features/auth/components/validationSchema.ts|15|export type LoginFormData = z.infer<typeof loginSchema>;
src/features/auth/components/index.tsx|22|interface LoginPageProps {
src/features/security/api/hooks/useEntityCrud.ts|6|type Id = number | string;
src/features/security/api/hooks/useEntityCrud.ts|8|export type EntityService<T, C = Partial<T>> = {
src/features/security/api/hooks/useUsersCrud.ts|1|import { useEntityCrud, type EntityService } from './useEntityCrud';
src/features/security/api/hooks/useUsersCrud.ts|8|type UserInput = CreateUserDTO | UpdateUserDTO | Partial<User>;
src/features/security/api/hooks/useRolesCrud.ts|1|import { useEntityCrud, type EntityService } from './useEntityCrud';
src/features/security/api/hooks/usePermissionsCrud.ts|1|import { useEntityCrud, type EntityService } from './useEntityCrud';
src/features/security/api/hooks/usePermissionsCrud.ts|8|type PermissionInput = Omit<Permission, 'permission_id'>;
src/features/security/api/hooks/useUserRolesCrud.ts|1|import { useEntityCrud, type EntityService } from './useEntityCrud';
src/features/security/api/hooks/useUserRolesCrud.ts|5|type UserRoleInput = { user_id: number; role_id: number };
src/features/security/api/user.dto.ts|18|export type CreateUserDto = Omit<User,
src/features/security/api/user.dto.ts|21|export type UpdateUserDto = Partial<CreateUserDto>;
src/features/security/api/permission.dto.ts|3|export type CreatePermissionDTO = Omit<Permission, 'permission_id'>;
src/features/security/api/permission.dto.ts|4|export type UpdatePermissionDTO = Omit<Permission, 'permission_id'>;
src/features/security/components/Users/UserForm.tsx|25|interface UsuarioCompleto extends UserFormValues {
src/features/security/components/Users/UserForm.tsx|29|type UserWithRole = {
src/features/security/components/Users/UserForm.tsx|56|interface Props {
src/features/security/components/Users/validationSchema.ts|29|export type UserFormValues = z.infer<typeof userSchema>;
src/features/security/components/Users/index.tsx|11|type UserInput = Partial<User>;
src/features/security/components/Users/index.tsx|30|type UserWithRole = (User & { rolId?: number }) & Record<string, unknown>;
src/features/security/components/common.messages.ts|14|export type SecurityCommonMessages = typeof securityCommonMessages;
src/features/security/components/Permissions/PermissionForm.tsx|17|export type PermissionFormValues = {
src/features/security/components/Permissions/PermissionForm.tsx|25|type PermissionFormProps = {
src/features/security/components/Roles/RoleForm.tsx|19|type RoleFormValues = {
src/features/security/components/Roles/RoleForm.tsx|24|interface RoleFormProps {
src/features/security/constants/permissions.ts|47|// Helper type para obtener los valores de los permisos
src/features/security/constants/permissions.ts|48|export type PermissionString = typeof PERMISSIONS[keyof typeof PERMISSIONS];
src/features/security/types/models.ts|1|export interface Role {
src/features/security/types/models.ts|8|export interface Permission {
src/features/security/types/models.ts|19|export interface User {
src/features/security/types/models.ts|45|export interface UserSession {
src/features/security/types/relations.ts|1|export interface RolePermission {
src/features/security/types/relations.ts|7|export interface UserRole {
src/features/security/types/dto.ts|4|export type CreateRoleDTO = Omit<Role, 'role_id'>;
src/features/security/types/dto.ts|5|export type UpdateRoleDTO = Partial<Omit<Role, 'role_id'>>;
src/features/security/types/dto.ts|8|export type CreateUserDTO = Omit<User, 'user_id'>;
src/features/security/types/dto.ts|9|export type UpdateUserFlagsDTO = {
src/features/security/types/dto.ts|13|export type UpdateUserDTO = Partial<


## Usos de any / @ts-ignore

## Duplicados y near-duplicates

- Kanban:
  - TareaType/ColumnaType/TableroType (español, snakeish keys) ↔ Task/Column/Board (canónicos propuestos, camelCase):
    - idTarea → id, contenido → content, usuariosAsignados → assignees, fechaVencimiento → dueDate, diasActivo → activeDays
    - idColumna → id, titulo → title, tareasIds → taskIds
    - tareas → tasks, columnas → columns, ordenColumnas → columnOrder
- Security:
  - User (snake_case, flags 0|1) ↔ UserSession (camelCase boolean, enriquecido). Mantener User para DTO, UserSession para sesión/UI.

## Canónicos definidos

- Kanban: Task, Column, Board en `src/features/kanban/types/index.ts` con re-exports de compatibilidad.
- Security: se mantienen `User` (DTO API), `UserSession` (UI/domino). Zod valida DTOs.

### Fase 1 – Endurecimiento de contratos y Public API

- Añadidos schemas Zod en `src/features/security/types/schemas.extra.ts`:
  - `RoleSchema`, `PermissionSchema`, `RolePermissionSchema`, `UserRoleSchema` y `PaginatedSchema` genérico.
  - Tipos inferidos `RoleDto`, `PermissionDto`, `RolePermissionDto`, `UserRoleDto`.
- Public API de Security consolidada en `src/features/security/index.ts` reexportando sólo lo público (types, schemas y api/components permitidos).
- Sin cambios funcionales; sólo tipado/estructura.

### Fase 1.1 – Contratos adicionales y refuerzos

- Shell/Menu: añadido `MenuItemSchema` (UI canónico) en `src/features/shell/types/schemas.menu.ts`.
- Security: añadidos `PaginatedRolesSchema` y `PaginatedPermissionsSchema` (helpers) en `schemas.extra.ts`.
- Core/tokens: creado `src/core/tokens.ts` con tokens base (color, spacing, radius) como esqueleto compatible con OrangeAlex DS.
- ErrorBoundary: añadido componente en `src/shared/components/ErrorBoundary/` para observabilidad por feature.

Checklist Fase 1.1
- [x] Schema de menú (UI)
- [x] Helpers de paginación en Security
- [x] Tokens base (no funcionales)
- [x] ErrorBoundary genérico

Checklist Fase 1
- [x] Schemas Zod para entidades de Security
- [x] Public API por feature (Security)
- [ ] ESLint boundaries (propuesta)

Propuesta ESLint Boundaries (pendiente de activar):
- Restringir imports entre features a través de sus `index.ts` públicos.
- Bloquear rutas con `/internal/`, `/components/components/` u otras que no estén expuestas públicamente.

## Reemplazos (mapa from → to)

- src/features/kanban/components/components/Column/index.tsx: `ColumnaType` → `Column`; `TareaType` → `Task`
- src/features/kanban/components/components/Task/index.tsx: `TareaType` → `Task`
- src/features/kanban/components/types.ts: `ApiTareaType` alias → `Task`
- Prop keys:
  - idTarea → id, contenido → content, usuariosAsignados → assignees, fechaVencimiento → dueDate, diasActivo → activeDays
  - idColumna → id, titulo → title, tareasIds → taskIds
  - tareas → tasks, columnas → columns, ordenColumnas → columnOrder

## DTOs justificados

- Security/User: API usa snake_case y flags 0|1; UI usa camelCase y booleanos. Se validan con Zod en borde API y no se crean mappers redundantes intra-UI.

## Auditoría de Security

- Canónicos:
  - User (contrato API, snake_case, flags 0|1)
  - UserSession (UI/domino, camelCase, booleanos, roles/permissions)
  - Role, Permission (únicos, sin duplicados funcionales)
- DTOs:
  - CreateRoleDTO/UpdateRoleDTO, CreateUserDTO/UpdateUserDTO y UpdateUserFlagsDTO: alineados al contrato. Los flags pueden admitirse como boolean | 0 | 1 a nivel DTO de update para compatibilidad mock/API.
- Mocks y Handlers:
  - users/roles/permissions usan los canónicos de Security; no hay tipos duplicados alternos.
  - relations y menu usan tipos auxiliares locales sin solapar con tipos de dominio Security.

Consolidación: no se encontraron variantes extra de User/Role/Permission fuera de las definiciones canónicas. Se mantiene separación clara de DTOs vs UI.

## Pendientes

- Verificar y eliminar referencias a productos: se removió ruta DEV_PRODUCTS y lazy import en AppRoutes; constante DEV_PRODUCTS comentada.
- Ejecutar tsc, ESLint y tests para validar en verde.

src/routes/ProtectedRoute.tsx:17:    phase: s.phase ?? (s.authReady ? 'ready' : 'idle'),
src/shared/hooks/useApiError.ts:11:  // ✅ Usamos 'unknown' en lugar de 'any' para mayor seguridad de tipos
manifest.md:204:## 9. Sin `any` y Tipado Estricto
manifest.md:206:- Prohibido el uso de `any`, `unknown` o `//@ts-ignore`.
manifest.md:249:- Regla sin `any`.
manifest.md:342:No usar any. Si no hay tipo, definir interfaces mínimas o usar genéricos con Record<string, unknown>.
manifest.md:381:No hay any ni ts-expect-error.
prompt_operativo_baseApp.md:76:   - Sin `any`, sin `//@ts-ignore`.
prompt_operativo_baseApp.md:98:No se usa any ni ts-expect-error.
src/shared/components/PermissionGate/index.tsx:6:  mode?: 'any' | 'all';
src/shared/components/PermissionGate/index.tsx:15:    ? mode === 'any'
CONTRIBUTING.md:7:- Sin `any`.
CONTRIBUTING.md:9:  - Excepciones documentadas: en `src/mocks/data/db.ts` se emplean guards adicionales (función `isDev()`) para entornos de test donde `import.meta` o `window` podrían no existir; mantener tipado estricto y evitar `any` igualmente.
CONTRIBUTING.md:92:- [ ] No hay `any` ni `@ts-expect-error`.
CONTRIBUTING.md:108:> - No se usa `any` ni `@ts-expect-error`.
docs/CODING_RULES.md:5:- Tipado estricto: prohibido `any`
docs/CODING_RULES.md:6:  - No usar `any`. Preferir tipos del dominio o `unknown` con narrowing.
docs/CODING_RULES.md:12:- Nada de parámetros implícitos `any`
public/mockServiceWorker.js:283: * @param {any} message
public/mockServiceWorker.js:285: * @returns {Promise<any>}
prompt_auditoria_baseApp.md:46:- [ ] Tipado estricto sin `any`  
src/shared/components/common/Entitytable/index.tsx:82:  // Ordenamiento seguro sin any
src/shared/components/common/Entitytable/index.tsx:104:  // CSS var para max-width sin usar any
src/shared/auth/bootstrapAuth.ts:27:      const perms = derivePermissions(userId, db);
src/shared/auth/bootstrapAuth.ts:28:      const user = { ...session.user, permissions: perms };
src/shared/auth/bootstrapAuth.ts:32:        console.log('[Auth] bootstrap ready', { user_id: user.user_id, perms: perms.map((p) => p.permission_string) });
src/shared/auth/bootstrapAuth.ts:48:    const perms = derivePermissions(userId, db);
src/shared/auth/bootstrapAuth.ts:49:    const user = { ...session.user, permissions: perms };
src/shared/auth/bootstrapAuth.ts:53:      console.log('[Auth] finalizeLogin ready', { user_id: user.user_id, perms: perms.map((p) => p.permission_string) });
src/shared/auth/derivePermissions.ts:3:export function derivePermissions(userId: number, db: MockDb | null | undefined): Permission[] {
src/features/auth/components/index.tsx:30:  const phase = useAuthStore.getState().phase ?? (useAuthStore.getState().authReady ? 'ready' : 'idle');
src/features/shell/state/authStore.ts:29:        const sessionUser = (res?.user ?? null) as UserSession | null;
src/features/shell/components/Header/index.tsx:8:  const phase = useAuthStore.getState().phase ?? (authReady ? 'ready' : 'idle');
src/features/security/components/Roles/Roles.scss:10:  /* Placeholder for any specific role page child layout */
src/features/shell/components/ResponsiveAppBar/UserProfileMenu.tsx:13:// Type guards para evitar 'any' implícitos
src/features/shell/components/ResponsiveAppBar/hooks/useMainMenu.ts:37:  const { isLoggedIn, phase, hasPermission } = useAuthStore((s) => ({ isLoggedIn: s.isLoggedIn, phase: s.phase ?? (s.authReady ? 'ready' : 'idle'), hasPermission: s.hasPermission }));
