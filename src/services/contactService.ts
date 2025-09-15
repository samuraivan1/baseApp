// src/services/contactService.ts
import apiClient from '@/services/apiClient';
import { Contacto, ContactFormValues } from '@/pages/Contacto/types';

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
