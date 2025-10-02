// src/services/contactService.ts
import apiClient from '@/shared/api/apiClient';
import { Contacto, ContactFormValues } from '@/shared/types/contact';

const API = '/contactos';

export const createContacto = async (
  payload: ContactFormValues
): Promise<Contacto> => {
  const { data } = await apiClient.post(API, {
    ...payload,
    creadoEn: new Date().toISOString(),
  });
  return data;
};

export const getContactos = async (): Promise<Contacto[]> => {
  const { data } = await apiClient.get(API);
  return data;
};
