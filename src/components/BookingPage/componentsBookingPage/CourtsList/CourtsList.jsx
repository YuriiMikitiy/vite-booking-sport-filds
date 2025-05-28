import React from 'react';
import CourtCard from '../CourtCard/CourtCard';
import Pagination from '../Pagination/Pagination';
import { getCorrectVariantWord } from '../../../utils/textUtils';
import './CourtsList.css';

const CourtsList = ({ courts, noResultsFound, totalCourts, onBook, onShowOnMap, pagination }) => {
  if (noResultsFound) {
    return (
      <div className="no-results-message">
        <h3>Нічого не знайдено</h3>
        <p>Спробуйте змінити параметри пошуку</p>
      </div>
    );
  }

  return (
    <>
      <p className="results-count">
        Ми знайшли {totalCourts} {getCorrectVariantWord(totalCourts)}
      </p>

      <div className="courts-list">
        {courts.map(court => (
          <CourtCard
            key={court.id}
            court={court}
            onBook={onBook}
            onShowOnMap={onShowOnMap}
          />
        ))}
      </div>

      {totalCourts > pagination.pageSize && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageNumbers={pagination.pageNumbers}
          nextPage={pagination.nextPage}
          prevPage={pagination.prevPage}
          goToPage={pagination.goToPage}
        />
      )}
    </>
  );
};

export default React.memo(CourtsList);