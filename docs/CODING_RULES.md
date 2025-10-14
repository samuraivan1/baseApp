# Reglas de Desarrollo (TipoScript + React)

Estas reglas son obligatorias. Documentan errores recurrentes que NO debemos permitir y cómo prevenirlos.

- Tipado estricto: prohibido `any`
  - No usar `any`. Preferir tipos del dominio o `unknown` con narrowing.
  - Tipar siempre parámetros de funciones y callbacks.

- `unknown` requiere narrowing
  - Validar antes de usar: `Array.isArray(x)`, `typeof x === 'string'`, `'prop' in x`.

- Nada de parámetros implícitos `any`
  - Especificar `item: Tipo` y `err: unknown` en callbacks.

- Sin bloques vacíos
  - Eliminar bloques `{}` vacíos o dejar comentario de intención.

- React Query (TanStack v5)
  - `useQuery` acepta `queryKey`, `queryFn`, etc.; evitar `onError` directo aquí.
  - Manejar errores vía `queryClient.setDefaultOptions` o hooks (`useApiError`).
  - Tipar el dato: `useQuery<MiTipo[]>({ queryKey, queryFn })`.

- Imports internos y barrels
  - Importar desde el barrel público (`index.ts`) por módulo.
  - No usar rutas internas no públicas (p. ej. `msw/browser`) en código de producción.

- Tipos exportados oficiales
  - Usar los tipos exportados desde `src/shared/types` o barrels de features.
  - No referenciar tipos que no existan o no estén exportados.

- Comentarios de supresión
  - Usar `@ts-expect-error` con explicación. Evitar `@ts-ignore`.

- Spread sólo en objetos
  - Asegurar genéricos con `T extends object` antes de hacer spread.

- Objetos con propiedades conocidas
  - Cumplir las firmas de librerías: no agregar props no soportadas.

## Permisos y seguridad
- Usa `PERMISSIONS` desde `src/features/security/constants/permissions.ts`.
- Evita strings literales de permisos.
- Si no existe `PermissionGate`, controla la UI con `useAuthStore().hasPermission(...)`.

## Entorno
- Usa `import.meta.env.DEV` para lógica exclusiva de desarrollo en app.
- Nota en mocks: `src/mocks/data/db.ts` utiliza un helper `isDev()` con guards para compatibilidad en tests; esta excepción aplica solo en mocks.
