export interface NavMenuItemBase {
  idMenu: number | string;
  titulo: string;
  ruta?: string;
  permisoId?: number | null;
  /**
   * Identificador estable para iconos, desacoplado de `titulo`/i18n.
   * Backwards compatible: si no se provee, se usa `titulo` como antes.
   */
  iconKey?: string;
}

export type NavMenuItem =
  | (NavMenuItemBase & { kind?: 'item'; items?: NavMenuItem[] })
  | (NavMenuItemBase & { kind: 'divider' });
