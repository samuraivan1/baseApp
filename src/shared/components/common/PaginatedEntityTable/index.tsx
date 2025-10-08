import React from 'react';
import EntityTable, { EntityTableColumn } from '@/shared/components/common/Entitytable';
import Pagination from '@/shared/components/common/Pagination';

export type PaginationConfig = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (n: number) => void;
};

export type PaginatedEntityTableProps<T extends Record<string, unknown>> = {
  columns: ReadonlyArray<EntityTableColumn<T>>;
  data: ReadonlyArray<T>;
  keyField: keyof T & string;
  footerClassName?: string;
  renderActions?: (row: T) => React.ReactNode;
  onRowDoubleClick?: (row: T) => void;
  pagination: PaginationConfig;
  autoFit?: boolean;
  centered?: boolean;
};

const PaginatedEntityTable = <T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  renderActions,
  onRowDoubleClick,
  pagination,
  autoFit,
  centered,
  footerClassName = 'entity-table__pagination',
}: PaginatedEntityTableProps<T>) => {
  return (
    <EntityTable
      columns={columns as EntityTableColumn<T>[]}
      data={data as T[]}
      keyField={keyField}
      autoFit={autoFit}
      centered={centered}
      renderActions={renderActions}
      onRowDoubleClick={onRowDoubleClick}
      footer={
        <div className={footerClassName}>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onChange}
            rowsPerPage={pagination.rowsPerPage}
            onRowsPerPageChange={pagination.onRowsPerPageChange}
          />
        </div>
      }
    />
  );
};

export default PaginatedEntityTable;
