import React from 'react';
import { paginationText } from './Pagination.messages';
import './Pagination.scss';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (rows: number) => void;
}

const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}) => {
  if (totalPages <= 1) {
    return null; // No mostrar paginación si solo hay una página
  }

  return (
    <div className="pagination-controls">
      <div className="pagination-rows-selector">
        <span>Filas por página:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>
      <div className="pagination-navigator">
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {paginationText.previous}
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {paginationText.next}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
