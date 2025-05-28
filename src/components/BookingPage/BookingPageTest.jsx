import React, { useState } from 'react';
import  useSearch  from './hooks/useSearch'
import  usePagination  from './hooks/usePagination';
import  useGeolocation  from './hooks/useGeolocation';
import SearchFilters from './componentsBookingPage/SearchFilters/SearchFilters';
import CourtsList from './componentsBookingPage/CourtsList/CourtsList';
import MapComponent from './componentsBookingPage/MapComponent/MapComponent';
import BookingModalChooseServices from './BookingModalChoseServices';
import BookingModalconfirmation from './BookingModalconfirmation';
import './BookingPageTest.css';

const BookingPageTest = () => {
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  
  const { searchParams, setSearchParams, sportFild, loading, noResultsFound } = useSearch();
  const { currentItems, pagination } = usePagination(sportFild, 4);
  const { userLocation, mapCenter, handleShowOnMap } = useGeolocation(sportFild);

  const handleBookCourt = (court) => {
    setSelectedCourt(court);
  };

  const handleConfirmBooking = (details) => {
    setBookingDetails({
      court: selectedCourt,
      bookingInfo: details
    });
    setSelectedCourt(null);
  };

  return (
    <div className="booking-page">
      {loading && <div className="loading-indicator">Завантаження...</div>}

      <div className="left-section">
        <SearchFilters 
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
        
        <CourtsList 
          courts={currentItems}
          noResultsFound={noResultsFound}
          totalCourts={sportFild.length}
          onBook={handleBookCourt}
          onShowOnMap={handleShowOnMap}
          pagination={pagination}
        />
      </div>

      <div className="right-section">
        <MapComponent 
          center={mapCenter}
          userLocation={userLocation}
          courts={sportFild}
        />
      </div>

      {selectedCourt && (
        <BookingModalChooseServices
          court={selectedCourt}
          onClose={() => setSelectedCourt(null)}
          onConfirm={handleConfirmBooking}
        />
      )}

      {bookingDetails && (
        <BookingModalconfirmation
          bookingDetails={bookingDetails}
          onClose={() => setBookingDetails(null)}
        />
      )}
    </div>
  );
};

export default BookingPageTest;
