## ⚙️ 5. Gestión de Estado y Hooks

baseApp separa el estado en **dos niveles complementarios**:

1. **Estado del servidor** — Datos obtenidos de la API, gestionados por **TanStack Query (React Query v5)**.
2. **Estado del cliente (UI)** — Preferencias, sesión y menús, gestionados con **Zustand (slices)**.

Esta separación garantiza consistencia, control de caché y predictibilidad.

---

### 5.1 Estado del servidor — TanStack Query

**Principio:** Todo dato proveniente del backend debe almacenarse en React Query, no en Zustand ni en useState.

```tsx
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/features/security/api/userService";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 60000,
  });
}
````

Reglas
Los hooks deben usar queryKey centralizadas en src/constants/queryKeys.ts.

Los servicios (api/\*Service.ts) no deben mostrar toasts ni manejar errores visuales.

React Query maneja reintentos, caché, invalidaciones y revalidaciones.

Beneficios
Datos sincronizados entre pestañas y sesiones.

Caché inteligente por clave.

Reintentos automáticos ante errores temporales.

5.2 Estado del cliente — Zustand
Zustand gestiona el estado de sesión y la UI: usuario logueado, menú lateral, tema, etc.

ts

import { create } from "zustand";

interface AuthState {
user: User | null;
isAuthenticated: boolean;
login: (u: User) => void;
logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
user: null,
isAuthenticated: false,
login: (u) => set({ user: u, isAuthenticated: true }),
logout: () => set({ user: null, isAuthenticated: false }),
}));
Patrones recomendados
Cada dominio define un “slice” (authSlice.ts, menuSlice.ts).

El store principal (src/app/store.ts) los combina.

Solo se guarda información de UI o sesión, nunca data del backend.

Hook de integración (ejemplo real)
tsx

const { user, logout } = useAuthStore();
if (user) console.log("Bienvenido", user.full_name);
5.3 Hooks personalizados
Los hooks deben:

Empezar con el prefijo use.

Ser puros (sin efectos secundarios fuera de useEffect).

No ejecutarse condicionalmente.

Documentarse en un README o con JSDoc.

Ejemplo de hook TanStack + toast controlado:

ts

import { useMutation } from "@tanstack/react-query";
import { apiCall } from "@/shared/api/apiCall";
import { updateRole } from "@/features/security/api/roleService";

export function useUpdateRole() {
return useMutation({
mutationFn: (dto) =>
apiCall(() => updateRole(dto), {
where: "security.roles.update",
toastOnError: true,
}),
});
}
title: "Componentes, Estilos y Global Design System (GDS)"
version: 1.0
status: active
last_sync: 2025-10-23
🎨 6. Componentes, Estilos y Global Design System (GDS)
El Global Design System (GDS) define la base visual de baseApp:
colores, espaciado, tipografía, tamaños y comportamiento interactivo.

6.1 Principios
SCSS modular (un archivo por componente).

Convención BEM (bloque\_\_elemento--modificador).

Tokens CSS globales en :root.

Sin estilos globales invasivos.

Variables y mixins en src/styles/\_variables.scss y \_mixins.scss.

6.2 Estructura típica
css

/Button
├── Button.tsx
├── Button.scss
└── index.ts
scss

@use '@/styles/variables' as vars;

.button {
background: var(--color-primary);
border-radius: var(--radius-md);
height: 36px;
color: #fff;

&--secondary {
background: var(--color-neutral-200);
color: #333;
}
}
6.3 Tokens globales
Definidos en src/styles/\_variables.scss y expuestos al DOM:

scss

:root {
--color-primary: #f26822;
--color-bg: #ffffff;
--radius-md: 6px;
--spacing-sm: 8px;
--spacing-md: 16px;
--font-size-base: 14px;
}
Cada componente debe consumir estas variables, nunca valores hex o px directos.

6.4 Ejemplo real: UserProfileMenu
tsx

import "./UserProfileMenu.scss";
export const UserProfileMenu = () => (

  <div className="user-menu">
    <div className="user-menu__header">
      <span className="user-menu__name">Juan Pérez</span>
      <span className="user-menu__email">juan@empresa.com</span>
    </div>
  </div>
);
scss

.user-menu {
position: absolute;
background-color: var(--surface-white);
border-radius: var(--radius-md);
box-shadow: 0 4px 12px rgba(0,0,0,0.15);

&**header { padding: var(--spacing-sm); }
&**name { font-weight: 600; }
}
6.5 Uso de mixins
Los mixins en \_mixins.scss centralizan patrones comunes:

scss

@mixin flex-center {
display: flex;
align-items: center;
justify-content: center;
}
Uso:

scss

.app-bar\_\_toolbar {
@include flex-center;
}
6.6 Storybook
Todo componente del GDS (Button, Modal, Pagination) debe tener historia (\*.stories.tsx) en Storybook para documentación y pruebas visuales.

title: "Formularios y Validaciones (RHF + Zod)"
version: 1.0
status: active
last_sync: 2025-10-23
🧾 7. Formularios y Validaciones (React Hook Form + Zod)
El estándar de formularios combina:

React Hook Form (RHF) para el manejo de estado del formulario.

Zod para validación tipada y mensajes consistentes.

7.1 Patrón base
tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/features/security/types/schemas";

export const UserForm = () => {
const { register, handleSubmit, formState } = useForm({
resolver: zodResolver(userSchema),
});

const onSubmit = (data) => console.log(data);

return (

<form onSubmit={handleSubmit(onSubmit)}>
<input {...register("email")} />
{formState.errors.email?.message}
<button type="submit">Guardar</button>
</form>
);
};
7.2 Schemas Zod
Ubicados en types/schemas.\*.ts dentro de cada feature.

ts

import { z } from "zod";

export const userSchema = z.object({
email: z.string().email("Correo inválido"),
password: z.string().min(8, "Mínimo 8 caracteres"),
});
7.3 Reglas
Cada formulario debe tener un schema único.

Las validaciones deben estar tipadas.

No se permiten condicionales con hooks RHF fuera de useForm.

Los mensajes de error se centralizan en .messages.ts.

7.4 Ejemplo real en baseApp
LoginPage usa React Hook Form + Zod:

tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./validationSchema";
import { authMessages } from "./LoginPage.messages";

const { register, handleSubmit, formState } = useForm({
resolver: zodResolver(loginSchema),
});

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register("username")} placeholder={authMessages.username} />
  {formState.errors.username && <span>{authMessages.invalidUser}</span>}
</form>;
title: "Consumo de API y Manejo de Errores"
version: 1.0
status: active
last_sync: 2025-10-23
🌐 8. Consumo de API y Manejo de Errores
baseApp utiliza un cliente HTTP único (apiClient.ts) configurado con Axios y mecanismos de seguridad integrados.

8.1 Cliente HTTP
ts

import axios from "axios";

const api = axios.create({
baseURL: "/api",
withCredentials: true,
});

api.interceptors.request.use((config) => {
// Añade token o CSRF
return config;
});
Todas las peticiones deben pasar por este cliente.

8.2 Servicios
Cada feature define sus servicios en api/\*Service.ts:

ts

import api from "@/shared/api/apiClient";
import { handleApiError } from "@/shared/api/errorService";

export async function getUsers() {
try {
const { data } = await api.get("/users");
return data;
} catch (e) {
throw handleApiError(e);
}
}
8.3 Mappers
El mapeo DTO ↔ dominio se hace en _.dto.ts o mappers/_.

ts

export const toUser = (dto) => ({
id: dto.user_id,
name: dto.name,
});
8.4 apiCall y withApiCall
apiCall normaliza respuestas y errores:

ts

const res = await apiCall(() => createRole(dto), {
where: "security.roles.create",
toastOnError: true,
});
if (res.ok) showToastSuccess("Rol creado");
withApiCall se usa para mutaciones dentro de handlers.

8.5 Manejo de errores
Los servicios lanzan AppError.

errorService centraliza el registro y envío a Sentry/DataDog.

No se lanzan strings; todos los errores se normalizan.

Los componentes usan ErrorBoundary o toasts.

title: "Seguridad, RBAC y Permisos"
version: 1.0
status: active
last_sync: 2025-10-23
🔒 9. Seguridad, RBAC y Permisos
El sistema implementa un Control de Acceso Basado en Roles (RBAC) tipado y centralizado.

9.1 Formato de permisos
dominio.recurso.accion

Ejemplo:

security.users.view

security.roles.update

9.2 Fuente única
src/features/security/constants/permissions.ts
Ejemplo:

ts

export const PERMISSIONS = {
SECURITY_USERS_VIEW: "security.users.view",
SECURITY_USERS_CREATE: "security.users.create",
};
9.3 Uso en rutas
tsx

<Route
path="/usuarios"
element={
<ProtectedRoute permiso={PERMISSIONS.SECURITY_USERS_VIEW}>
<UsersPage />
</ProtectedRoute>
}
/>
9.4 Uso en UI
tsx

const canEdit = useAuthStore((s) =>
s.hasPermission(PERMISSIONS.SECURITY_USERS_UPDATE)
);
{canEdit && <Button>Editar</Button>}
9.5 Roles mock de desarrollo
Definidos en src/mocks/data/db.ts:

Admin: todos los permisos (\*).

Editor: lectura + edición.

Viewer: solo vista.

9.6 Flujo de autenticación
Login → recibe JWT y roles.

silentRefresh → renueva sesión.

useAuthStore → mantiene user y permissions.

ProtectedRoute → bloquea acceso si no cumple permiso.

---

---

title: "Errores, Logging y Mensajes"
version: 1.0
status: active
last_sync: 2025-10-23

---
