export type CommonMessages = {
  save: string;
  saving: string;
  cancel: string;
  delete: string;
  edit: string;
  update: string;
  add: string;
  refresh: string;
  filters: string;
  exportCsv: string;
  loading: string;
  yes: string;
  no: string;
  rowsPerPage: string;
  pageOf: string; // Use placeholders: Página {page} de {total}
  confirm: string;
};

// Message ids are stable keys for i18n extraction
export const commonMessageIds = {
  save: 'common.save',
  saving: 'common.saving',
  cancel: 'common.cancel',
  delete: 'common.delete',
  edit: 'common.edit',
  update: 'common.update',
  add: 'common.add',
  refresh: 'common.refresh',
  filters: 'common.filters',
  exportCsv: 'common.exportCsv',
  loading: 'common.loading',
  yes: 'common.yes',
  no: 'common.no',
  rowsPerPage: 'common.rowsPerPage',
  pageOf: 'common.pageOf',
  confirm: 'common.confirm',
} as const;

// Default messages in Spanish (can be used as fallbacks)
export const commonDefaultMessages: CommonMessages = {
  save: 'Guardar',
  saving: 'Guardando…',
  cancel: 'Cancelar',
  delete: 'Eliminar',
  edit: 'Editar',
  update: 'Actualizar',
  add: 'Añadir',
  refresh: 'Actualizar',
  filters: 'Más filtros',
  exportCsv: 'Exportar CSV',
  loading: 'Cargando…',
  yes: 'Sí',
  no: 'No',
  rowsPerPage: 'Filas por página:',
  pageOf: 'Página {page} de {total}',
  confirm: 'Confirmar',
};
