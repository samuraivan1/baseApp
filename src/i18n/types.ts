export type CommonMessages = {
  save: string;
  saving: string;
  cancel: string;
  delete: string;
  edit: string;
  update: string;
  add: string;
  loading: string;
  refresh: string;
  filters: string;
  exportCsv: string;
  yes: string;
  no: string;
  rowsPerPage: string;
  pageOf: (page: number, total: number) => string;
};

export type ScreenActions = {
  create: string;
  update: string;
  delete: string;
  export: string;
  refresh: string;
  filters: string;
  add: string;
};

export type ScreenMessages = {
  title: string;
  loading: string;
  actions: ScreenActions;
};

