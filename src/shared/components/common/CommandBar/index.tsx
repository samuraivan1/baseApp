import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSync, faFilter, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import './CommandBar.scss';

import type { FilterableColumn } from '@/shared/components/common/CommandBar/types';
import Button from '@/shared/components/ui/Button';
import { commandBarMessages } from './CommandBar.messages';

interface CommandBarProps {
  // búsqueda
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSearch?: () => void; // compat: ya no se muestra botón

  // filtros dinámicos
  showFilters: boolean;
  onToggleFilters: () => void;
  filterableColumns: FilterableColumn[];
  onFilterChange: (filters: Record<string, string>) => void;

  // acciones
  onAdd?: () => void;
  onRefresh: () => void;
  onExportExcel: () => void;

  // labels (centralizados en *.messages.ts)
  searchPlaceholder?: string;
  searchLabel?: string; // compat: ya no se muestra botón
  addLabel?: string;
  refreshLabel?: string;
  filtersLabel?: string;
  excelLabel?: string;
}

const CommandBar: React.FC<CommandBarProps> = ({
  // búsqueda
  searchTerm,
  setSearchTerm,
  // onSearch,

  // filtros
  showFilters,
  onToggleFilters,
  filterableColumns,
  onFilterChange,

  // acciones
  onAdd,
  onRefresh,
  onExportExcel,

  // labels
  searchPlaceholder = commandBarMessages.placeholder,
  // searchLabel = commandBarMessages.search,
  addLabel = commandBarMessages.add,
  refreshLabel = commandBarMessages.refresh,
  filtersLabel = commandBarMessages.filters,
  excelLabel = commandBarMessages.exportCsv,
}) => {
  type Filter = { id: string; field: string; value: string };
  const [filters, setFilters] = React.useState<Filter[]>([]);
  const handleKeyDown = (_e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter ya no dispara búsqueda explícita; búsqueda es en vivo
  };

  const addFilter = () => {
    if (filters.some((f) => !f.value) || filterableColumns.length === 0) return;
    const used = new Set(filters.map((f) => f.field));
    const firstAvailable = filterableColumns.map((c) => c.key).find((k) => !used.has(k));
    if (!firstAvailable) return; // no hay campos disponibles
    setFilters((prev) => [
      ...prev,
      { id: `filter-${Date.now()}`, field: firstAvailable, value: '' },
    ]);
  };
  const updateFilter = (id: string, field: string, value: string) => {
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, field, value } : f)));
  };
  const removeFilter = (id: string) => setFilters((prev) => prev.filter((f) => f.id !== id));
  const clearFilters = () => setFilters([]);

  // Notificar al padre cuando cambian los filtros
  React.useEffect(() => {
    const active = filters.reduce<Record<string, string>>((acc, f) => {
      const v = f.value.trim();
      if (v) acc[f.field] = v;
      return acc;
    }, {});
    onFilterChange(active);
  }, [filters, onFilterChange]);

  return (
    <div className="command-bar__container">
      <div className="command-bar">
        {/* 1 (50%): búsqueda + más filtros */}
        <div className="command-bar__search">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {/* Botón de búsqueda removido: búsqueda en vivo por onChange */}
          <Button
            className="command-bar__filters"
            variant="secondary"
            size="small"
            onClick={onToggleFilters}
            icon={faFilter}
          >
            {filtersLabel}
          </Button>
        </div>

        {/* 2 (25%): añadir + actualizar */}
        <div className="command-bar__actions">
          {onAdd && addLabel && (
            <Button className="command-bar__button add" variant="primary" size="small" onClick={onAdd} icon={faPlus}>
              {addLabel}
            </Button>
          )}
          <Button className="command-bar__button refresh" variant="secondary" size="small" onClick={onRefresh} icon={faSync}>
            {refreshLabel}
          </Button>
        </div>

        {/* 3 (25%): exportar excel (alineado a la derecha) */}
        <div className="command-bar__export">
          <Button className="command-bar__button--excel" variant="secondary" size="small" onClick={onExportExcel}>
            <FontAwesomeIcon icon={faFileExcel} />
            <span>{excelLabel}</span>
          </Button>
        </div>
      </div>

      {/* bloque de filtros dinámicos debajo */}
      {showFilters && (
        <div className="command-bar__dynamic-filters">
          {filters.length > 0 && (
            <div className="df-rows">
              {filters.map((f) => (
                <div key={f.id} className="df-row">
                  <select
                    value={f.field}
                    onChange={(e) => updateFilter(f.id, e.target.value, f.value)}
                  >
                    {(() => {
                      const used = new Set(filters.map((x) => x.field));
                      // Permitimos el campo actual y excluimos otros ya usados
                      return filterableColumns
                        .filter((c) => c.key === f.field || !used.has(c.key))
                        .map((c) => (
                          <option key={c.key} value={c.key}>
                            {c.label}
                          </option>
                        ));
                    })()}
                  </select>
                  <input
                    type="text"
                    value={f.value}
                    placeholder={`Valor para ${
                      filterableColumns.find((c) => c.key === f.field)?.label || '...'
                    }`}
                    onChange={(e) => updateFilter(f.id, f.field, e.target.value)}
                  />
                  <Button variant="danger" size="small" onClick={() => removeFilter(f.id)}>
                    Eliminar
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="df-actions">
            <Button
              variant="primary"
              size="small"
              onClick={addFilter}
              disabled={filterableColumns.every((c) => filters.some((f) => f.field === c.key))}
            >
              Añadir Filtro
            </Button>
            <Button variant="secondary" size="small" onClick={clearFilters} disabled={filters.length === 0}>
              Limpiar filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandBar;
