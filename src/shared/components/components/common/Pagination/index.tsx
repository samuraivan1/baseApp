import React from 'react';
import './Pagination.scss';
import { paginationMessages } from './Pagination.messages';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (rows: number) => void;
  rowsPerPageOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
}) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="pagination">
      <div className="pagination__rows">
        <label htmlFor="rowsPerPage">{paginationMessages.rowsPerPage}</label>
        <select
          id="rowsPerPage"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
        >
          {rowsPerPageOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="pagination__info">{paginationMessages.pageOf(currentPage, totalPages)}</div>

      <div className="pagination__controls">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="pagination__btn"
        >
          <span className="pagination-arrow">◀</span>
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="pagination__btn"
        >
          <span className="pagination-arrow">▶</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
