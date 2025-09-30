import React from 'react';
import './EntityTable.scss';

export interface ColumnDefinition<T> {
  header: string;
  accessor: keyof T;
  isPrincipal?: boolean;
  weight?: number; // ancho relativo (por defecto 1)
  nowrap?: boolean; // evita salto de línea para compactar por contenido
}

interface Props<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  renderActions: (item: T) => React.ReactNode;
  // ✅ 1. Añadimos la nueva propiedad 'keyField'
  keyField: keyof T;
  centered?: boolean; // Centrar el contenedor
  actionColumnWidth?: string; // Ej.: '160px' o '15%'
  maxWidth?: string; // ancho máximo opcional cuando centered=true (p. ej. '960px')
  autoFit?: boolean; // Si true, la tabla se ajusta al contenido (ancho dinámico)
}

// ✅ 2. Eliminamos la restricción de que T deba tener una propiedad 'id'
const EntityTable = <T extends object>({
  data,
  columns,
  renderActions,
  keyField, // Usamos la nueva prop
  centered = true,
  actionColumnWidth = '120px',
  maxWidth = '960px',
  autoFit = true,
}: Props<T>) => {
  const totalWeight = columns.reduce((acc, c) => acc + (c.weight ?? 1), 0) || 1;
  const wrapperStyle = centered
    ? ({ ['--table-max-width' as any]: maxWidth } as React.CSSProperties)
    : undefined;

  return (
    <div
      className={`table-wrapper ${centered ? 'table-wrapper--centered' : ''}`.trim()}
      style={wrapperStyle}
    >
      <table
        className={`modern-table ${autoFit ? 'modern-table--autofit' : ''}`.trim()}
        style={autoFit ? { tableLayout: 'auto', width: 'max-content' } : { tableLayout: 'fixed' }}
      >
        {!autoFit && (
          <colgroup>
            {columns.map((c) => {
              const w = ((c.weight ?? 1) / totalWeight) * 100;
              return (
                <col
                  key={String(c.accessor)}
                  style={{ width: `calc((100% - ${actionColumnWidth}) * ${w / 100})` }}
                />
              );
            })}
            <col style={{ width: actionColumnWidth }} />
          </colgroup>
        )}
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
                  className={`${col.isPrincipal ? 'principal-cell ' : ''}${col.nowrap ? 'cell--nowrap' : ''}`.trim()}
                >
                  {/* TypeScript ahora entiende que item[col.accessor] es válido */}
                  {String(item[col.accessor] ?? '')}
                </td>
              ))}
              <td>
                <div className="table-actions">{renderActions(item)}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EntityTable;
