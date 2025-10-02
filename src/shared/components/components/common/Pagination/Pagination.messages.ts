// src/components/common/Pagination/Pagination.messages.ts
// Delegamos a commonMessages para mantener consistencia i18n
import { commonDefaultMessages } from '@/i18n/commonMessages';

export const paginationMessages = {
  previous: 'Anterior',
  next: 'Siguiente',
  rowsPerPage: commonDefaultMessages.rowsPerPage,
  pageOf: (page: number, total: number) =>
    commonDefaultMessages.pageOf
      .replace('{page}', String(page))
      .replace('{total}', String(total)),
};
