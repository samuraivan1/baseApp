# Base App React (Vite + TS + Zustand + React Query)

Este proyecto está construido con **Vite** y utiliza las siguientes tecnologías principales:

- ⚛️ React 18 + TypeScript
- 🎨 SCSS modular
- 🗂️ Zustand (estado cliente)
- 🔄 TanStack Query (estado servidor)
- 🔐 Rutas protegidas con permisos
- 📡 Axios con interceptores
- 📘 Storybook
- 🧪 Vitest + Testing Library + Playwright
- 🛠️ MSW (API mock)

---

## 🚀 Scripts disponibles

En la carpeta del proyecto puedes ejecutar:

### `npm run dev`

Inicia la app en modo desarrollo con Vite.  
Abre [http://localhost:5173](http://localhost:5173) en el navegador.

### `npm run build`

Genera el build de producción en la carpeta `dist/`.

### `npm run preview`

Sirve localmente el build ya generado.

### `npm run server`

MSW intercepta las peticiones en desarrollo y en tests usando los handlers en `src/mocks`. Los datos semilla provienen de `src/mocks/db.json`.

### Estándar de llamadas HTTP
- Usa siempre `apiClient` desde `src/shared/api/apiClient.ts` para cualquier llamada HTTP.
- `baseURL` por defecto: `'/api'` (puede sobrescribirse con `VITE_API_BASE_URL`).
- Evita `axios` directo o `fetch` para endpoints backend; si es necesario, compón las URLs con el mismo `baseURL` del cliente.
- Define rutas relativas al `baseURL` (ej.: `apiClient.post('/auth/login', ...)`).

#### Inicializar/actualizar Service Worker de MSW

Genera el archivo oficial del worker en `public/mockServiceWorker.js`:

```
npx msw init public --save
```

- Ejecútalo cuando actualices la versión de `msw`.
- El repo incluye un placeholder mínimo para desarrollo, pero se recomienda usar el archivo oficial.

#### Persistencia de los mocks (solo dev)

- Los cambios en runtime se guardan en `localStorage` bajo la clave `msw:db`.
- Para resetear a la semilla de `src/mocks/db.json` usa el botón flotante “Reset seed” o ejecuta:

```
localStorage.removeItem('msw:db'); location.reload();
```

### `npm run test`

Ejecuta pruebas unitarias con **Vitest**.

### `npm run storybook`

Inicia Storybook en el puerto `6006`.

### `npm run build-storybook`

Genera el build estático de Storybook.

---

## 🛠️ Configuración

- **API Base URL**: se carga dinámicamente desde `public/config.json` al iniciar la app.
- **Alias**: el alias `@` apunta a `./src`.
- **Estilos globales**: definidos en `src/styles/_variables.scss` y `src/styles/_mixins.scss`.

---

## 📂 Estructura

src/
├── assets/ # Imágenes y recursos
├── components/ # UI y componentes comunes
├── constants/ # Constantes globales (permisos, API, etc.)
├── hooks/ # Hooks personalizados
├── lib/ # queryClient y utilidades globales
├── mocks/ # MSW para pruebas
├── pages/ # Páginas de la aplicación
├── routes/ # Definición de rutas y ProtectedRoute
├── services/ # Lógica API y cliente axios
├── store/ # Estado global (Zustand)
├── styles/ # SCSS global
└── utils/ # Utilidades

## yaml

## 📦 Mock API

El proyecto usa MSW con `src/mocks/db.json` para simular un backend sin levantar servidores adicionales (no se requiere json-server ni server.js).  
Se ejecuta con:

```bash
npm run server

```
🔒 Sistema de permisos

Nivel 1 (páginas): page:...

Nivel 2 (acciones): user:system:create, etc.
Se validan con ProtectedRoute y usePermission.
