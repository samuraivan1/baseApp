import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'; // ✅ 1. Importa tipos de Axios
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import { authMessages } from '@/constants/commonMessages';
import { getConfig } from './configService';

const apiClient = axios.create({
  // ✅ 3. Usa la URL del servicio de configuración en lugar de import.meta.env
  //baseURL: config.API_BASE_URL,
});

// --- Interceptor de Petición (Request) ---
// Se ejecuta ANTES de que cada petición sea enviada.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    //    En este punto, garantizamos que initializeApp() ya terminó.
    const appConfig = getConfig();
    if (appConfig.API_BASE_URL) {
      config.baseURL = appConfig.API_BASE_URL;
    }
    // Obtenemos el estado del authStore sin estar en un componente de React
    const { isLoggedIn, user } = useAuthStore.getState();

    // Si el usuario está logueado, añadimos el token al encabezado
    if (isLoggedIn && user?.bearerToken) {
      config.headers.Authorization = `Bearer ${user.bearerToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // Maneja errores en la configuración de la petición
    return Promise.reject(error);
  }
);

// --- Interceptor de Respuesta (Response) ---
// Se ejecuta DESPUÉS de recibir una respuesta (o un error).
apiClient.interceptors.response.use(
  // El primer argumento es para respuestas exitosas (2xx)
  (response) => {
    // No hacemos nada, solo devolvemos la respuesta
    return response;
  },
  // El segundo argumento es para respuestas con error
  (error: AxiosError) => {
    // Verificamos si el error es por sesión expirada (401 No Autorizado)
    if (error.response && error.response.status === 401) {
      // Obtenemos la acción logout de nuestro store
      const { logout } = useAuthStore.getState();

      // Cerramos la sesión del usuario
      logout();

      // Mostramos una notificación
      toast.error(authMessages.sessionExpired);

      // Opcional: redirigir al login
      // window.location.href = '/login';
    }

    // Devolvemos el error para que pueda ser manejado por el catch del componente si es necesario
    return Promise.reject(error);
  }
);

export default apiClient;
