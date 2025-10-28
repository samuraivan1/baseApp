import api from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';
import type { IMenu } from '../types/models';
import {
  type MenuResponseDTO,
  type CreateMenuRequestDTO,
  type UpdateMenuRequestDTO,
  mapMenuFromDto,
} from '../types/dto';

export async function getMenus(): Promise<IMenu[]> {
  try {
    const { data } = await api.get<MenuResponseDTO[]>('/menus');
    return data.map(mapMenuFromDto);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createMenu(input: CreateMenuRequestDTO): Promise<IMenu> {
  try {
    const { data } = await api.post<MenuResponseDTO>('/menus', input);
    return mapMenuFromDto(data);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateMenu(id: number, input: UpdateMenuRequestDTO): Promise<IMenu> {
  try {
    const { data } = await api.put<MenuResponseDTO>(`/menus/${id}`, input);
    return mapMenuFromDto(data);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function deleteMenu(id: number): Promise<void> {
  try {
    await api.delete(`/menus/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
}
