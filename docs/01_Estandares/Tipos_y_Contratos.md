---
status: archived
reason: "Movido desde raíz a /docs/01_Estandares/"
---
<!-- Contenido original de TYPES_STANDARD.md a continuación -->

# Estándar de Tipos y DTOs (baseApp)

## Principios
- Interfaces de dominio con prefijo `I<Name>`: `IUser`, `IRole`, `IPermission`.
- DTOs con sufijo `DTO`: `CreateUserDTO`, `UserResponseDTO`.
- Enums con prefijo `E<Name>` centralizados cuando sean compartidos.
- Propiedades en `camelCase` para modelos de dominio. Si la API expone `snake_case`, define mappers UI↔API y documenta la divergencia.
- Evitar `any`/`unknown`/`object`; usar tipos concretos, `Record<K,V>` o genéricos.
- Fechas: preferir `Date` en UI; si la API usa `string`, convertir en la capa de mapeo.

## Convenciones
- Interfaces inmutables anotadas con `readonly` cuando aplique.
- Separar Modelos de Dominio (`models.ts`), Relaciones (`relations.ts`) y DTOs (`dto.ts`). Los modelos de dominio usan camelCase; los DTOs mantienen el contrato API (snake_case si aplica).
- Diferenciar Request/Response cuando difieran: `CreateUserRequestDTO` vs `UserResponseDTO`.
- Generics base en `src/shared/types/api.ts`: `ApiResponse<T>`, `PaginatedResponse<T>`.

## Ejemplos
Antes
```
export interface user {
  name: any;
  created: string;
  isActive?: boolean;
}
```
Después
```
/** Representa un usuario activo dentro del sistema. */
export interface IUser {
  readonly userId: string;
  name: string;
  createdAt: Date;
  isActive: boolean;
}
```

## Zod y validación
- Schemas Zod por entidad y por DTO (request/response) en `types/schemas.*.ts`.
- Anotar con `// TODO: refine type` donde falte validación o haya coerción insegura.

## Generics base
- `ApiResponse<T>` y `PaginatedResponse<T>` obligatorios para endpoints. Mantener `id: string | number`, `createdAt: Date`, `updatedAt: Date` en modelos; transformar desde/ hacia `created_at`/`updated_at` en DTOs.

## Enums
- Centralizar en `src/shared/types/enums.ts` con prefijo `E<Name>`.

## Ejemplos de mapeo UI↔API
```
// Dominio
export interface IUser { userId: number; createdAt: Date }

// DTO API
export type UserResponseDTO = { user_id: number; created_at: string }

// Mapper
export const toUser = (dto: UserResponseDTO): IUser => ({
  userId: dto.user_id,
  createdAt: new Date(dto.created_at),
});
```

## Nombres
- Interfaces: `I<Name>`
- DTOs: `<Name>DTO`
- Enums: `E<Name>`
- Genéricos: `PascalCase`
- Tipos locales: `camelCase`

## Transformaciones
- Todas las transformaciones UI ↔ API deben estar en `*.dto.ts` o `api/mappers/*` y ser puras.
