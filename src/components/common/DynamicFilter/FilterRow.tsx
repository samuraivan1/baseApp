import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FilterableColumn, Filter } from './types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import './FilterRow.scss';

interface FilterRowProps {
  filter: Filter;
  columns: FilterableColumn[];
  onUpdate: (id: string, newField: string, newValue: string) => void;
  onRemove: (id: string) => void;
}

const FilterRow: React.FC<FilterRowProps> = ({
  filter,
  columns,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="filter-row">
      <select
        className="filter-row__select"
        value={filter.field}
        onChange={(e) => onUpdate(filter.id, e.target.value, filter.value)}
      >
        {columns.map((col) => (
          <option key={col.key} value={col.key}>
            {col.label}
          </option>
        ))}
      </select>
      <Input
        type="text"
        className="filter-row__input"
        placeholder={`Valor para ${
          columns.find((c) => c.key === filter.field)?.label || '...'
        }`}
        value={filter.value}
        onChange={(e) => onUpdate(filter.id, filter.field, e.target.value)}
      />
      <Button
        variant="secondary"
        size="small"
        onClick={() => onRemove(filter.id)}
        icon={faTrashAlt}
      >
        Eliminar
      </Button>
    </div>
  );
};

export default FilterRow;