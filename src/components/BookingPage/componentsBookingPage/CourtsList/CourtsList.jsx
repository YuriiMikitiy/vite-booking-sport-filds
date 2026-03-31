import React, { useContext } from 'react';
import { LanguageContext } from "../../../assets/LanguageContext";
import CourtCard from '../CourtCard/CourtCard';
import Pagination from '../Pagination/Paginations';
import { getCorrectVariantWord } from '../../../utils/textUtils';

const CourtsList = ({ courts, noResultsFound, totalCourts, onBook, onShowOnMap, pagination }) => {
  const { language, translations } = useContext(LanguageContext);
  const t = translations[language];

  if (noResultsFound) {
    return (
      <div className="no-results-message">
        <h3>{t.common.error}</h3>
        <p>{t.inputSection.searchHint}</p>
      </div>
    );
  }

  return (
    <>
      <p className="results-count">
        {t.results.found} {totalCourts} {getCorrectVariantWord(totalCourts)}
      </p>
      <div className="courts-list">
        {courts.map(court => <CourtCard key={court.id} court={court} onBook={onBook} onShowOnMap={onShowOnMap} />)}
      </div>
      {totalCourts > 4 && <Pagination {...pagination} />}
    </>
  );
};

export default React.memo(CourtsList);