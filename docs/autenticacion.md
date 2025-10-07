Autenticación JWT + Refresh (cliente React)

Arquitectura
- Cliente HTTP único: `src/shared/api/apiClient.ts`
  - `baseURL`: `/api` (override con `VITE_API_BASE_URL` en producción)
  - `withCredentials: true`: envía cookies HttpOnly al backend
  - Interceptor de request: añade `Authorization: Bearer <accessToken>` si existe token en `authStore` y `X-CSRF-Token` en mutaciones
  - Interceptor de response:
    - Si 401 (y no es `/auth/login` o `/auth/refresh`), ejecuta refresh por cookie HttpOnly en `POST /auth/refresh`, actualiza `accessToken` y reintenta la petición original
    - Si la respuesta es de `/auth/login` o `/auth/refresh`, guarda `csrf_token` en `localStorage`

Flujo de login (Spring Boot sugerido)
1. `POST /auth/login` con credenciales; el backend debe:
   - Responder con `access_token`, `refresh_token` (opcional, si también se setea cookie) y `csrf_token`
   - Setear cookie HttpOnly/SameSite para el refresh (p. ej., `refresh_token` cookie)
2. El cliente guarda `access_token` en `authStore` y `csrf_token` en `localStorage`.
3. Las siguientes peticiones usan `Authorization: Bearer <access_token>` automáticamente.

Refresh token (cookie HttpOnly)
- Ante un 401, el cliente llama `POST /auth/refresh` con `withCredentials: true`.
- El backend debe validar la cookie de refresh y devolver un `access_token` nuevo (y opcionalmente `csrf_token`).
- El cliente actualiza el token en `authStore` y reintenta la petición fallida.
- Si el refresh falla, se ejecuta `logout()`.

CSRF (mutaciones)
- El cliente añade `X-CSRF-Token` en `POST/PUT/PATCH/DELETE` si hay un `csrf_token` en `localStorage`.
- El backend puede validar este header además del JWT.

Servicios de dominio (Security)
- `features/security/api/*.ts` consumen `apiClient`, por lo que heredan `Authorization` y `refresh` automático.
- Tipos de dominio (`User`, `Role`, `Permission`, etc.) se definen en `features/security/types` y se re-exportan para uso compartido.

Buenas prácticas en Spring Boot
- Configurar CORS para permitir `credentials` y el origen del frontend.
- Endpoints:
  - `/auth/login`: setea cookie de refresh y responde con `access_token` + `csrf_token`.
  - `/auth/refresh`: lee cookie HttpOnly, devuelve `access_token` (y `csrf_token` opcional).
  - Rutas protegidas: validar `Authorization: Bearer <access_token>`.
- Asegurar flags de seguridad en cookies: `HttpOnly`, `SameSite=Lax/Strict`, `Secure` en producción.

