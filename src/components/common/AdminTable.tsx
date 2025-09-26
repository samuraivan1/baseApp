import React from 'react';
import './AdminUI.scss';

export interface ColumnDefinition<T> {
  header: string;
  accessor: keyof T;
  isPrincipal?: boolean;
}

interface Props<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  renderActions: (item: T) => React.ReactNode;
  // ✅ 1. Añadimos la nueva propiedad 'keyField'
  keyField: keyof T;
}

// ✅ 2. Eliminamos la restricción de que T deba tener una propiedad 'id'
const AdminTable = <T extends object>({
  data,
  columns,
  renderActions,
  keyField, // Usamos la nueva prop
}: Props<T>) => {
  return (
    <div className="table-wrapper">
      <table className="modern-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.accessor)}>{col.header}</th>
            ))}
            <th className="action-column-header">Acción</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            // ✅ 3. Usamos la prop 'keyField' para obtener el valor de la clave única
            <tr key={String(item[keyField])}>
              {columns.map((col) => (
                <td
                  key={String(col.accessor)}
                  className={col.isPrincipal ? 'principal-cell' : ''}
                >
                  {/* TypeScript ahora entiende que item[col.accessor] es válido */}
                  {String(item[col.accessor] ?? '')}
                </td>
              ))}
              <td>
                <div className="action-links">{renderActions(item)}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;