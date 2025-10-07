import api from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';

export type Product = {
  product_id: number;
  name: string;
  price: number;
  description?: string | null;
};

export type ProductInput = Omit<Product, 'product_id'>;

export async function getProducts(): Promise<Product[]> {
  try {
    const { data } = await api.get<Product[]>('/products');
    return data;
  } catch (e) {
    throw handleApiError(e);
  }
}

export async function createProduct(input: ProductInput): Promise<Product> {
  try {
    const { data } = await api.post<Product>('/products', input);
    return data;
  } catch (e) {
    throw handleApiError(e);
  }
}

export async function updateProduct(id: number, input: ProductInput): Promise<Product> {
  try {
    const { data } = await api.put<Product>(`/products/${id}`, input);
    return data;
  } catch (e) {
    throw handleApiError(e);
  }
}

export async function deleteProduct(id: number): Promise<void> {
  try {
    await api.delete(`/products/${id}`);
  } catch (e) {
    throw handleApiError(e);
  }
}

