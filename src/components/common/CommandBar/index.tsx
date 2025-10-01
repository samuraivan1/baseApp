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

import DynamicFilter from '@/components/common/DynamicFilter';
import type { FilterableColumn } from '@/components/common/DynamicFilter/types';

interface CommandBarProps {
  // búsqueda
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSearch: () => void;

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
  searchLabel: string;
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch();
  };

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
          <button className="command-bar__button" onClick={onSearch}>
            <FontAwesomeIcon icon={faSearch} />
            <span>{searchLabel}</span>
          </button>
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
          <DynamicFilter
            columns={filterableColumns}
            onFilterChange={onFilterChange}
          />
        </div>
      )}
    </div>
  );
};

export default CommandBar;
