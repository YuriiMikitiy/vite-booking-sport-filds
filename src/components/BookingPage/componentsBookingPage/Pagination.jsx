import React from "react";

export default function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 6;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="pagination">
      <button
        onClick={prevPage}
        disabled={currentPage === 1}
        className={currentPage === 1 ? "disabled" : ""}
      >
        &lt;
      </button>
      {getPageNumbers().map((number) => (
        <button
          key={number}
          onClick={() => setCurrentPage(number)}
          className={currentPage === number ? "active" : ""}
        >
          {number}
        </button>
      ))}
      <button
        onClick={nextPage}
        disabled={currentPage === totalPages}
        className={currentPage === totalPages ? "disabled" : ""}
      >
        &gt;
      </button>
    </div>
  );
}