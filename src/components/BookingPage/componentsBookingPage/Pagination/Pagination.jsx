import React from 'react';
import './Pagination.css';

const Pagination = ({
  currentPage,
  totalPages,
  pageNumbers,
  nextPage,
  prevPage,
  goToPage
}) => {
  return (
    <div className="pagination">
      <button
        onClick={prevPage}
        disabled={currentPage === 1}
        className={currentPage === 1 ? "disabled" : ""}
        aria-label="Попередня сторінка"
      >
        &lt;
      </button>

      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => goToPage(number)}
          className={currentPage === number ? "active" : ""}
          aria-label={`Сторінка ${number}`}
        >
          {number}
        </button>
      ))}

      <button
        onClick={nextPage}
        disabled={currentPage === totalPages}
        className={currentPage === totalPages ? "disabled" : ""}
        aria-label="Наступна сторінка"
      >
        &gt;
      </button>
    </div>
  );
};

export default React.memo(Pagination);