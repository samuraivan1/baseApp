# Manual de Creación de Pantallas desde el Patrón de Permisos

## 1. Resumen y Principios

Este manual describe cómo crear una nueva pantalla de tipo catálogo (CRUD) en `baseApp`, replicando el patrón establecido por el módulo de **Permisos** (`src/features/security/components/Permissions`).

El patrón consiste en una pantalla con:

-   **`PageHeader`**: Título de la página.
-   **`CommandBar`**: Barra de comandos con acciones (buscar, agregar, filtrar, exportar).
-   **`PaginatedEntityTable`**: Tabla paginada para mostrar las entidades.
-   **Formulario Embebido**: Un formulario que aparece en la misma vista para crear o editar una entidad, sin usar modales.

### Referencias a Estándares

-   [Arquitectura General (FSD)](./03_arquitectura-general-fsd.md)
-   [Estructura de Carpetas y Módulos](./04_estructura-de-carpetas-y-modulos.md)
-   [Gestión de Estado y Hooks](./05_gesti-n-de-estado-y-hooks.md)
-   [Formularios y Validaciones (RHF + Zod)](./07_formularios-y-validaciones-rhf-zod.md)
-   [Consumo de API y Manejo de Errores](./08_consumo-de-api-y-manejo-de-errores.md)
-   [Seguridad, RBAC y Permisos](./09_seguridad-rbac-y-permisos.md)

## 2. Mapa de Archivos del Patrón `Permisos`

La siguiente tabla muestra los archivos clave que componen el módulo de `Permisos` y que servirán de base para crear una nueva pantalla.

| Rol | Archivo | Puntos Clave |
| --- | --- | --- |
| **Pantalla Principal** | `src/features/security/components/Permissions/index.tsx` | Orquesta `PageHeader`, `CommandBar`, `PaginatedEntityTable` y el formulario. Gestiona el estado de la UI (filtros, paginación, visibilidad del form). |
| **Formulario** | `src/features/security/components/Permissions/PermissionForm.tsx` | Formulario con `react-hook-form` y `zod`. Se muestra/oculta en la misma página. |
| **Esquema (Zod)** | `src/features/security/components/Permissions/permission.schema.ts` | Define la estructura y validaciones del formulario. Exporta `permissionSchema` y `PermissionFormValues`. |
| **Mensajes (i18n)** | `src/features/security/components/Permissions/Permissions.messages.ts` | Centraliza todos los textos de la UI para internacionalización. |
| **Servicios API** | `src/features/security/api/permissionService.ts` | Contiene las funciones para interactuar con la API (get, create, update, delete). |
| **Hooks CRUD** | `src/features/security/api/hooks/usePermissionsCrud.ts` | Abstrae la lógica de `useQuery` y `useMutation` para las operaciones CRUD, usando `useEntityCrud`. |
| **Tipos y DTOs** | `src/features/security/types/dto.ts` y `models.ts` | Define los `DTOs` (Data Transfer Objects) que se mapean a los modelos de dominio (`IPermission`). |
| **Rutas** | `src/routes/AppRoutes.tsx` | Registra la ruta de la pantalla, protegida por `ProtectedRoute`. |
| **Permisos RBAC** | `src/features/security/constants/permissions.ts` | Define los strings de permisos (ej. `SECURITY_PERMISSIONS_VIEW`). |
| **Mock Handlers** | `src/mocks/handlers/permissions.ts` | Simula los endpoints de la API para desarrollo con `msw`. |
| **Base de Datos Mock**| `src/mocks/db.json` | Contiene los datos de prueba para los mocks. |

## 3. Checklist de Pre-requisitos (MUST)

Antes de empezar, asegúrate de que tu entorno y el nuevo módulo cumplan con:

-   **TypeScript Estricto**: `tsconfig.json` con `"strict": true`. No usar `any`.
-   **SCSS Modular**: Cada componente con su propio archivo `.scss` y usando BEM.
-   **RBAC**: Permisos definidos en el formato `dominio.recurso.accion`.
-   **i18n**: No usar strings literales en el JSX.
-   **MSW**: La API debe estar mockeada para desarrollo.

## 4. Guía Paso a Paso para Crear una Nueva Pantalla

Vamos a crear un catálogo de **"Productos"** como ejemplo.

### 1. Crear la Estructura de Carpetas

Crea la siguiente estructura dentro de `src/features/products/`:

```
src/features/products/
├── api/
│   ├── hooks/
│   │   └── useProductsCrud.ts
│   └── productService.ts
├── components/
│   └── Products/
│       ├── index.tsx
│       ├── ProductForm.tsx
│       ├── product.schema.ts
│       └── Products.messages.ts
├── constants/
│   └── permissions.ts
├── types/
│   ├── dto.ts
│   └── models.ts
└── index.ts
```

### 2. Definir Tipos y DTOs

**`src/features/products/types/models.ts`**
```typescript
export interface IProduct {
  productId: number;
  name: string;
  description: string | null;
  sku: string;
}
```

**`src/features/products/types/dto.ts`**
```typescript
import { IProduct } from './models';

export interface ProductResponseDTO {
  product_id: number;
  name: string;
  description?: string | null;
  sku: string;
}

export type CreateProductRequestDTO = Omit<ProductResponseDTO, 'product_id'>;
export type UpdateProductRequestDTO = Partial<CreateProductRequestDTO>;

export const mapProductFromDto = (dto: ProductResponseDTO): IProduct => ({
  productId: dto.product_id,
  name: dto.name,
  description: dto.description ?? null,
  sku: dto.sku,
});
```

### 3. Crear el Servicio API

**`src/features/products/api/productService.ts`**
```typescript
import api from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';
import type { IProduct } from '../types/models';
import {
  type ProductResponseDTO,
  type CreateProductRequestDTO,
  type UpdateProductRequestDTO,
  mapProductFromDto,
} from '../types/dto';

export async function getProducts(): Promise<IProduct[]> {
  try {
    const { data } = await api.get<ProductResponseDTO[]>('/products');
    return data.map(mapProductFromDto);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createProduct(input: CreateProductRequestDTO): Promise<IProduct> {
  try {
    const { data } = await api.post<ProductResponseDTO>('/products', input);
    return mapProductFromDto(data);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateProduct(id: number, input: UpdateProductRequestDTO): Promise<IProduct> {
  try {
    const { data } = await api.put<ProductResponseDTO>(`/products/${id}`, input);
    return mapProductFromDto(data);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function deleteProduct(id: number): Promise<void> {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
}
```

### 4. Crear el Hook CRUD

**`src/features/products/api/hooks/useProductsCrud.ts`**
```typescript
import { useEntityCrud } from '@/features/security/api/hooks/useEntityCrud';
import type { EntityService } from '@/features/security/api/hooks/useEntityCrud';
import type { IProduct } from '../../types/models';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../productService';
import type { CreateProductRequestDTO, UpdateProductRequestDTO } from '../../types/dto';
import { useSafeMutation } from '@/shared/hooks/useSafeMutation';
import { useQueryClient } from '@tanstack/react-query';

type CreateInput = CreateProductRequestDTO;
type UpdateInput = UpdateProductRequestDTO;

export function useProductsCrud() {
  const qc = useQueryClient();
  const service: EntityService<IProduct, CreateInput> = {
    list: getProducts,
    create: (input: CreateInput) => createProduct(input),
    update: (id: number | string, input: CreateInput | UpdateInput) => updateProduct(Number(id), input as UpdateInput),
    remove: (id: number | string) => deleteProduct(Number(id)),
  };

  const crud = useEntityCrud<IProduct, CreateInput>('products', service);

  const create = useSafeMutation<IProduct, CreateInput>(
    (input) => createProduct(input),
    { onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) }
  );
  const update = useSafeMutation<IProduct, { id: number; input: UpdateInput }>(
    ({ id, input }) => updateProduct(id, input),
    { onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) }
  );
  const remove = useSafeMutation<void, number>(
    (id) => deleteProduct(id),
    { onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) }
  );

  return { ...crud, create, update, remove };
}
```

### 5. Definir Mensajes y Esquema del Formulario

**`src/features/products/components/Products/Products.messages.ts`**
```typescript
export const productsMessages = {
  title: 'Productos',
  loading: 'Cargando productos...',
  searchPlaceholder: 'Buscar por nombre, SKU...',
  createButton: 'Nuevo Producto',
  // ...otros mensajes
};
```

**`src/features/products/components/Products/product.schema.ts`**
```typescript
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  sku: z.string().min(1, 'El SKU es requerido'),
  description: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
```

### 6. Crear el Formulario y la Pantalla Principal

Copia y adapta el contenido de `PermissionForm.tsx` y `Permissions/index.tsx` a `ProductForm.tsx` y `Products/index.tsx` respectivamente, reemplazando las referencias a `Permission` con `Product`, `usePermissionsCrud` con `useProductsCrud`, etc.

### 7. Definir Permisos RBAC

**`src/features/products/constants/permissions.ts`**
```typescript
export const PRODUCT_PERMISSIONS = {
  PRODUCTS_VIEW: 'products.products.view',
  PRODUCTS_CREATE: 'products.products.create',
  PRODUCTS_UPDATE: 'products.products.update',
  PRODUCTS_DELETE: 'products.products.delete',
};
```

Añade estos permisos a `src/features/security/constants/permissions.ts` para que estén disponibles globalmente.

### 8. Registrar la Ruta

**`src/routes/AppRoutes.tsx`**
```typescript
// ... imports
import { ProductsPage } from '@/features/products';
import { PRODUCT_PERMISSIONS } from '@/features/products/constants/permissions';

// ... dentro de <Routes>
<Route
  path="/productos"
  element={
    <ProtectedRoute permiso={PRODUCT_PERMISSIONS.PRODUCTS_VIEW}>
      <ProductsPage />
    </ProtectedRoute>
  }
/>
```

### 9. Mockear la API

**`src/mocks/handlers/products.ts`** (archivo nuevo)
```typescript
import { http, HttpResponse } from 'msw';
import { db } from '../data/db';

const BASE = '/api/products';

export const productsHandlers = [
  http.get(BASE, () => {
    return HttpResponse.json(db.products);
  }),
  // ...otros handlers (POST, PUT, DELETE)
];
```

**`src/mocks/handlers.ts`**
```typescript
import { productsHandlers } from './handlers/products';
// ...
export const handlers = [
  ...productsHandlers,
  // ...otros handlers
];
```

**`src/mocks/db.json`**
```json
{
  "products": [
    {
      "product_id": 1,
      "name": "Producto 1",
      "sku": "P001",
      "description": "Descripción del producto 1"
    }
  ],
  // ...otras colecciones
}
```

### 10. Calidad

Ejecuta los siguientes comandos para asegurar que todo está en orden:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## 5. Plan de Cambios por Archivos

### Archivos a Crear

-   `src/features/products/api/hooks/useProductsCrud.ts`
-   `src/features/products/api/productService.ts`
-   `src/features/products/components/Products/index.tsx`
-   `src/features/products/components/Products/ProductForm.tsx`
-   `src/features/products/components/Products/product.schema.ts`
-   `src/features/products/components/Products/Products.messages.ts`
-   `src/features/products/constants/permissions.ts`
-   `src/features/products/types/dto.ts`
-   `src/features/products/types/models.ts`
-   `src/features/products/index.ts`
-   `src/mocks/handlers/products.ts`

### Archivos a Modificar

-   `src/routes/AppRoutes.tsx`: Añadir la nueva ruta.
-   `src/features/security/constants/permissions.ts`: Registrar los nuevos permisos.
-   `src/mocks/handlers.ts`: Importar y usar los nuevos handlers.
-   `src/mocks/db.json`: Añadir la colección de datos para `products`.
-   `src/features/shell/components/Sidebar/Sidebar.tsx` (o similar): Añadir el enlace en el menú de navegación.

## 6. Plantillas Mínimas de Código (Stubs)

(Las plantillas ya se proporcionaron en la guía paso a paso)

## 7. RBAC y Semilla de Permisos

Para asignar los nuevos permisos a los roles, deberás modificar la semilla de datos en `src/mocks/db.json` en la colección `role_permissions`.

| Permiso | Rol Admin | Rol Editor | Rol Viewer |
| --- | :---: | :---: | :---: |
| `products.products.view` | ✅ | ✅ | ✅ |
| `products.products.create` | ✅ | ✅ | ❌ |
| `products.products.update` | ✅ | ✅ | ❌ |
| `products.products.delete` | ✅ | ❌ | ❌ |

## 8. Definition of Done (DoD)

-   [ ] El código compila sin errores de TypeScript.
-   [ ] El linter no reporta errores.
-   [ ] La nueva ruta está registrada y protegida.
-   [ ] El enlace a la nueva pantalla aparece en el menú.
-   [ ] El acceso a la pantalla y a las acciones (CRUD) está controlado por RBAC.
-   [ ] La API está mockeada y los datos se muestran en la tabla.
-   [ ] No hay strings literales en el código JSX.
-   [ ] No se utiliza `any`.
-   [ ] Los estilos siguen el GDS.

## 9. Anexos de Verificación

-   **Comandos**: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
-   **Salida Esperada**: Todos los comandos deben finalizar sin errores.
-   **Estándares**:
    -   [Arquitectura General (FSD)](./03_arquitectura-general-fsd.md)
    -   [Seguridad, RBAC y Permisos](./09_seguridad-rbac-y-permisos.md)
    -   [Formularios y Validaciones (RHF + Zod)](./07_formularios-y-validaciones-rhf-zod.md)
