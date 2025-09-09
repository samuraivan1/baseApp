import apiClient from './apiClient'; // ✅ 1. Importa nuestro cliente configurado
import { NavMenuItem, BoardType, RoleType, UserType } from './api.types';

// Ya no necesitamos 'axios' aquí

// ✅ 2. Reemplaza 'axios.get' por 'apiClient.get' y elimina la URL base
export const fetchMenu = async (): Promise<NavMenuItem[]> => {
  const { data } = await apiClient.get('/menu');
  return data;
};

export const fetchProfileMenu = async (): Promise<NavMenuItem[]> => {
  const { data } = await apiClient.get('/menuprofile');
  return data;
};

export const fetchBoard = async (): Promise<BoardType> => {
  const { data } = await apiClient.get('/board');
  return data;
};

/*export const updateBoard = async (newBoardState: BoardType): Promise<BoardType> => {
  const { data } = await apiClient.put('/board', newBoardState);
  return data;
};*/

// ✅ --- INICIO DE LA SIMULACIÓN DE ERROR --- ✅
export const updateBoard = async (
  newBoardState: BoardType
): Promise<BoardType> => {
  // 1. Añadimos un console.log para ver que la función se llama.
  console.log(
    'Intentando guardar el tablero (simulación de fallo)...',
    newBoardState
  );

  // 2. Simulamos un retraso de 2 segundos para que el efecto sea visible.
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 3. Forzamos a que la petición siempre falle, devolviendo un error.
  return Promise.reject(new Error('Error de red simulado'));
};
// ✅ --- FIN DE LA SIMULACIÓN --- ✅
// ✅ Añade la nueva función para obtener los roles

// --- Seguridad API ---
// --- Seguridad API ---
export const fetchRoles = async (): Promise<RoleType[]> => {
  const { data } = await apiClient.get('/roles');
  return data;
};

export const fetchUsers = async (): Promise<UserType[]> => {
  const { data } = await apiClient.get('/usuario');
  return data;
};
