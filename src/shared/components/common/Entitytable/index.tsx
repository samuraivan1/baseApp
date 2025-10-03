import React, { useMemo, useState, CSSProperties } from 'react';
import './EntityTable.scss';
import Pagination from '@/shared/components/common/Pagination';

/** Columna genérica de la EntityTable */
export interface EntityTableColumn<T extends object> {
  key: keyof T;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean; // ordenamiento opcional
}

/** Props de paginación integrados en la tabla */
export interface EntityTablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (rows: number) => void;
}

export interface EntityTableProps<T extends object> {
  columns: EntityTableColumn<T>[];
  data: T[];
  /** Campo clave único, por ejemplo "role_id" */
  keyField: keyof T;
  /** Render de acciones por fila (columna de la derecha) */
  renderActions?: (row: T) => React.ReactNode;
  /** Ancho fijo para la columna de acciones (ej. "120px") */
  actionColumnWidth?: string;
  /** Ajuste automático al contenido (tabla más angosta) */
  autoFit?: boolean;
  /** Centrar la tabla en el contenedor (modo “delgado”) */
  centered?: boolean;
  /** Máximo de ancho cuando está centrada (por defecto 960px) */
  maxWidth?: string;
  /** Paginación integrada en el pie de la tabla (fuera del scroll) */
  pagination?: EntityTablePaginationProps;
  /** Slot de pie de tabla. Si se proporciona, tiene prioridad sobre `pagination`. */
  footer?: React.ReactNode;
}

type CSSVars = CSSProperties & { ['--table-max-width']?: string };

function EntityTable<T extends object>({
  columns,
  data,
  keyField,
  renderActions,
  actionColumnWidth = '120px',
  autoFit = false,
  centered = false,
  maxWidth = '960px',
  pagination,
  footer,
}: EntityTableProps<T>): React.ReactElement {
  // Estado de ordenamiento
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    null
  );

  const handleSort = (key: keyof T) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection('asc');
    } else {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    }
  };

  // Ordenamiento seguro sin any
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const va = a[sortKey] as unknown;
      const vb = b[sortKey] as unknown;

      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;

      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDirection === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
      }

      return sortDirection === 'asc'
        ? String(va as unknown as string).localeCompare(String(vb as unknown as string))
        : String(vb as unknown as string).localeCompare(String(va as unknown as string));
    });
  }, [data, sortKey, sortDirection]);

  // CSS var para max-width sin usar any
  const wrapperStyle: CSSVars = centered
    ? { ['--table-max-width']: maxWidth }
    : {};

  return (
    <div className="entity-table">
      {/* BODY con scroll interno */}
      <div
        className={`table-wrapper ${centered ? 'table-wrapper--centered' : ''}`.trim()}
        style={wrapperStyle}
      >
        <table
          className={`modern-table ${autoFit ? 'modern-table--autofit' : ''}`.trim()}
        >
          <thead>
            <tr>
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={String(col.key)}
                    className={col.className}
                    onClick={() => col.sortable && handleSort(col.key)}
                    style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                  >
                    {col.label}
                    {col.sortable && (
                      <span className="sort-indicator">
                        {isSorted && sortDirection === 'asc' && ' ▲'}
                        {isSorted && sortDirection === 'desc' && ' ▼'}
                      </span>
                    )}
                  </th>
                );
              })}
              {renderActions && (
                <th
                  className="action-column-header"
                  style={{ width: actionColumnWidth }}
                >
                  ACCIÓN
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row) => {
              const rowKey = String(row[keyField]);
              return (
                <tr key={rowKey}>
                  {columns.map((col) => {
                    const value = row[col.key as keyof T] as unknown;
                    return (
                      <td key={String(col.key)} className={col.className}>
                        {col.render
                          ? col.render(row)
                          : (value as React.ReactNode)}
                      </td>
                    );
                  })}
                  {renderActions && (
                    <td className="table-actions">{renderActions(row)}</td>
                  )}
                </tr>
              );
            })}
            {sortedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  style={{ textAlign: 'center', padding: '0.75rem' }}
                >
                  Sin datos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER fuera del scroll: si hay `footer` lo mostramos; si no, usamos paginación integrada */}
      {footer ? (
        <div className="entity-table__footer">{footer}</div>
      ) : pagination ? (
        <div className="entity-table__pagination">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
            rowsPerPage={pagination.rowsPerPage}
            onRowsPerPageChange={pagination.onRowsPerPageChange}
          />
        </div>
      ) : null}
    </div>
  );
}

export default EntityTable;
