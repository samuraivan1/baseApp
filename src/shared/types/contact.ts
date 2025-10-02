export interface Contacto {
  contacto_id: number;
  nombre: string;
  email: string;
  telefono?: string;
  creadoEn?: string;
}
export interface ContactFormValues {
  nombre: string;
  email: string;
  telefono?: string;
}
