import React from "react";
// import CourtCard from "../BookingPage/componentsBookingPage/CourtCard/CourtCard.jsx";
import CourtCard from "../componentsBookingPage/CourtCard/CourtCard.jsx" 
import { getCorrectVariantWord } from "../BookingPage.jsx";


export default function ResultsDisplay({
  sportFild,
  selectedSport,
  noResultsFound,
  currentPage,
  itemsPerPage,
  setSelectedCourt,
  setSelectedSportType,
  handleShowOnMap,
}) {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sportFild.slice(indexOfFirstItem, indexOfLastItem);

  return noResultsFound ? (
    <div className="no-results-message">
      <h3>Нічого не знайдено</h3>
      <p>Спробуйте змінити параметри пошуку</p>
    </div>
  ) : (
    <>
      <p className="results-count">
        Ми знайшли {sportFild.length} {getCorrectVariantWord(sportFild.length)}
      </p>
      <CourtCard
        courts={currentItems}
        selectedSport={selectedSport}
        setSelectedCourt={setSelectedCourt}
        setSelectedSportType={setSelectedSportType}
        handleShowOnMap={handleShowOnMap}
      />
    </>
  );
}