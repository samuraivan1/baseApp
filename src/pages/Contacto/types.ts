// src/pages/Contacto/types.ts
export type ContactFormValues = {
  nombre: string;
  email: string;
  mensaje?: string | null;
  fecha_contacto?: string | null; // ISO date string
};

export type Contacto = ContactFormValues & {
  id?: number;
  creadoEn?: string;
};
