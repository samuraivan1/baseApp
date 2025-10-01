import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSync,
  faSearch,
  faFilter,
  faFileExcel,
} from '@fortawesome/free-solid-svg-icons';
import './CommandBar.scss';

import type { FilterableColumn } from '@/components/common/CommandBar/types';
import Button from '@/components/ui/Button';

interface CommandBarProps {
  // búsqueda
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSearch: () => void; // compat: ya no se muestra botón

  // filtros dinámicos
  showFilters: boolean;
  onToggleFilters: () => void;
  filterableColumns: FilterableColumn[];
  onFilterChange: (filters: Record<string, string>) => void;

  // acciones
  onAdd: () => void;
  onRefresh: () => void;
  onExportExcel: () => void;

  // labels (centralizados en *.messages.ts)
  searchPlaceholder: string;
  searchLabel: string; // compat: ya no se muestra botón
  addLabel: string;
  refreshLabel: string;
  filtersLabel: string;
  excelLabel: string;
}

const CommandBar: React.FC<CommandBarProps> = ({
  // búsqueda
  searchTerm,
  setSearchTerm,
  onSearch,

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
  searchPlaceholder,
  searchLabel,
  addLabel,
  refreshLabel,
  filtersLabel,
  excelLabel,
}) => {
  type Filter = { id: string; field: string; value: string };
  const [filters, setFilters] = React.useState<Filter[]>([]);
  const handleKeyDown = (_e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter ya no dispara búsqueda explícita; búsqueda es en vivo
  };

  const addFilter = () => {
    if (filters.some((f) => !f.value) || filterableColumns.length === 0) return;
    setFilters((prev) => [
      ...prev,
      { id: `filter-${Date.now()}`, field: filterableColumns[0].key, value: '' },
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
          <button className="command-bar__filters" onClick={onToggleFilters}>
            <FontAwesomeIcon icon={faFilter} />
            <span>{filtersLabel}</span>
          </button>
        </div>

        {/* 2 (25%): añadir + actualizar */}
        <div className="command-bar__actions">
          <button className="command-bar__button add" onClick={onAdd}>
            <FontAwesomeIcon icon={faPlus} />
            <span>{addLabel}</span>
          </button>
          <button className="command-bar__button refresh" onClick={onRefresh}>
            <FontAwesomeIcon icon={faSync} />
            <span>{refreshLabel}</span>
          </button>
        </div>

        {/* 3 (25%): exportar excel (alineado a la derecha) */}
        <div className="command-bar__export">
          <button
            className="command-bar__button--excel"
            onClick={onExportExcel}
          >
            <FontAwesomeIcon icon={faFileExcel} />
            <span>{excelLabel}</span>
          </button>
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
                    {filterableColumns.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={f.value}
                    placeholder={`Valor para ${
                      filterableColumns.find((c) => c.key === f.field)?.label || '...'
                    }`}
                    onChange={(e) => updateFilter(f.id, f.field, e.target.value)}
                  />
                  <Button variant="secondary" size="small" onClick={() => removeFilter(f.id)}>
                    Eliminar
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="df-actions">
            <Button variant="secondary" size="small" onClick={addFilter}>
              Añadir Filtro
            </Button>
            <Button variant="outline" size="small" onClick={clearFilters} disabled={filters.length === 0}>
              Limpiar filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandBar;
