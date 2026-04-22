import React, { useContext } from "react";
import { LanguageContext } from "../../../assets/LanguageContext.jsx";
import CourtCard from "./CourtCard/CourtCard.jsx";
import { getCorrectVariantWord } from "../BookingPage.jsx";

export default function ResultsDisplay({ sportFild, noResultsFound, currentPage, itemsPerPage, setSelectedCourt, handleShowOnMap }) {
  const { language, translations } = useContext(LanguageContext);
  const t = translations[language];

  return noResultsFound ? (
    <div className="no-results-message">
      <h3>{t.common.error}</h3>
      <p>{t.inputSection.searchHint}</p>
    </div>
  ) : (
    <>
      <p className="results-count">
        {t.results.found} {sportFild.length} {getCorrectVariantWord(sportFild.length)}
      </p>
      <CourtCard courts={sportFild.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage)} setSelectedCourt={setSelectedCourt} handleShowOnMap={handleShowOnMap} />
    </>
  );
}