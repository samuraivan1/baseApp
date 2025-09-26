import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FilterableColumn, Filter } from './types';
import FilterRow from './FilterRow';
import Button from '@/components/ui/Button';
import './DynamicFilter.scss';

interface DynamicFilterProps {
  columns: FilterableColumn[];
  onFilterChange: (activeFilters: Record<string, string>) => void;
}

const DynamicFilter: React.FC<DynamicFilterProps> = ({
  columns,
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<Filter[]>([]);

  // Notificar a la página padre cuando los filtros cambien
  useEffect(() => {
    const activeFilters = filters.reduce((acc, f) => {
      if (f.value.trim()) {
        acc[f.field] = f.value.trim();
      }
      return acc;
    }, {} as Record<string, string>);
    onFilterChange(activeFilters);
  }, [filters, onFilterChange]);

  const addFilter = () => {
    // Evitar añadir si ya hay un filtro vacío o no hay columnas
    if (filters.some((f) => !f.value) || columns.length === 0) return;

    setFilters([
      ...filters,
      {
        id: `filter-${Date.now()}`,
        field: columns[0].key,
        value: '',
      },
    ]);
  };

  const updateFilter = (id: string, newField: string, newValue: string) => {
    setFilters(
      filters.map((f) =>
        f.id === id ? { ...f, field: newField, value: newValue } : f
      )
    );
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter((f) => f.id !== id));
  };

  return (
    <div className="dynamic-filter-panel">
      {filters.length > 0 && (
        <div className="dynamic-filter-panel__rows">
          {filters.map((filter) => (
            <FilterRow
              key={filter.id}
              filter={filter}
              columns={columns}
              onUpdate={updateFilter}
              onRemove={removeFilter}
            />
          ))}
        </div>
      )}

      <div className="dynamic-filter-panel__actions">
        <Button
          variant="secondary"
          size="small"
          onClick={addFilter}
          icon={faFilter}
        >
          Añadir Filtro
        </Button>
      </div>
    </div>
  );
};

export default DynamicFilter;