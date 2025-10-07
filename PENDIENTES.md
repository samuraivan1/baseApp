# Pendientes de Autenticación

- Evaluar eliminar header `Authorization` y usar solo cookies HttpOnly para autorización cuando el backend tenga CSRF 100% aplicado y CORS afinado. Implicaciones:
  - Requiere validar CSRF en todos los métodos mutadores en backend.
  - Ajustar CORS con `Access-Control-Allow-Credentials: true` y `SameSite` correcto.
  - Actualizar MSW para simular cookies (parcialmente hecho).
  - Implica adaptar tooling (Postman/cURL) o exponer tokens de servicio para pruebas.

- Consolidar mocks para reflejar cookies HttpOnly (hoy simuladas sin HttpOnly por limitación de MSW).

- Documentar endpoints de auth expuestos por el backend:
  - `POST /auth/login` → Set-Cookie (refresh), body `{ user, access_token?, csrf_token? }`
  - `POST /auth/refresh` → Set-Cookie (refresh), body `{ access_token, csrf_token? }`
  - `POST /auth/logout` → expira cookies
  - `GET /auth/session` → `{ user }`

# Pendientes de Sesión/Inactividad

- Evaluar activar `useIdleLogout` en el shell con timeout (ej. 15 min) y advertencia previa (modal o toast con countdown). Consideraciones:
  - Pausar el temporizador en formularios activos o cuando la ventana no está visible.
  - Configurar exclusiones (páginas con reproducción o tareas largas).
  - Confirmar UX con stakeholders.

- Revisar pantalla o layout que muestra "restaurando sesión": asegurarse de que depende solo de `authReady` del store y que no haya otros flags que bloqueen el render tras `login()` y `loadSession()`.
