export interface NavMenuItem {
  idMenu: number | string;
  titulo: string;
  ruta?: string;
  permisoId?: number | null;
  items?: NavMenuItem[];
}

