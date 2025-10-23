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
