import api from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';

export async function force422(): Promise<Response | void> {
  try {
    return await api.post('/dev/force-422', null);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function backendDown(): Promise<void> {
  try {
    await api.get('http://127.0.0.1:5999/down');
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function force401(): Promise<void> {
  try {
    await api.get('/dev/force-401');
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function force403(): Promise<void> {
  try {
    await api.get('/dev/force-403');
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function force404(): Promise<void> {
  try {
    await api.get('/dev/force-404');
  } catch (error) {
    throw handleApiError(error);
  }
}

