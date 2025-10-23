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
