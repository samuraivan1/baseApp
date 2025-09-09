import apiClient from './apiClient';
import {
  NavMenuItem,
  TableroType,
  RolType,
  UsuarioType,
  PermisoType,
} from './api.types';

// --- Menu API ---
export const fetchMenu = async (): Promise<NavMenuItem[]> => {
  const { data } = await apiClient.get('/menu');
  return data;
};

export const fetchProfileMenu = async (): Promise<NavMenuItem[]> => {
  const { data } = await apiClient.get('/menuPerfil');
  return data;
};

// --- Kanban API ---
export const fetchTablero = async (): Promise<TableroType> => {
  const { data } = await apiClient.get('/tablero');
  return data;
};

/*export const updateTablero = async (newState: TableroType): Promise<TableroType> => {
  const { data } = await apiClient.put('/tablero', newState);
  return data;
};*/

// ✅ --- INICIO DE LA SIMULACIÓN DE ERROR --- ✅
export const updateTablero = async (
  newState: TableroType
): Promise<TableroType> => {
  // 1. Añadimos un console.log para ver que la función se llama.
  console.log(
    'Intentando guardar el tablero (simulación de fallo)...',
    newState
  );
  // 2. Simulamos un retraso de 2 segundos para que el efecto sea visible.
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // 3. Forzamos a que la petición siempre falle, devolviendo un error.
  return Promise.reject(new Error('Error de red simulado'));
};
// ✅ --- FIN DE LA SIMULACIÓN --- ✅
// ✅ Añade la nueva función para obtener los roles

// --- Seguridad API ---
export const fetchRoles = async (): Promise<RolType[]> => {
  const { data } = await apiClient.get('/roles');
  return data;
};

export const fetchUsuarios = async (): Promise<UsuarioType[]> => {
  const { data } = await apiClient.get('/usuarios');
  return data;
};

export const fetchPermisos = async (): Promise<PermisoType[]> => {
  const { data } = await apiClient.get('/permisos');
  return data;
};
