import React, { useEffect, useState, useRef } from "react";
import "./BookingPage.css";
import { fetchSportFild, fetchFilteredSportFild } from "../../../services/sportFild.js";
import { sports } from "../HomaPage/InputSection/dateTime";

import CitySelector from "./componentsBookingPage/CitySelector.jsx";
import SearchFilters from "./componentsBookingPage/SearchFilters.jsx";
import ResultsDisplay from "./componentsBookingPage/ResultsDisplay.jsx";
import Pagination from "./componentsBookingPage/Pagination.jsx";
import MapView from "./componentsBookingPage/MapView.jsx";

import BookingModalconfirmation from "./BookingModalconfirmation";
import BookingModalChooseServices from "./BookingModalChoseServices.jsx";

const cities = [
  { ua: "Усі міста", en: null, coordinates: [50.4501, 30.5234] },
  { ua: "Київ", en: "Kyiv", coordinates: [50.4501, 30.5234] },
  { ua: "Львів", en: "Lviv", coordinates: [49.8397, 24.0297] },
  { ua: "Одеса", en: "Odesa", coordinates: [46.4825, 30.7233] },
  { ua: "Харків", en: "Kharkiv", coordinates: [49.9935, 36.2304] },
  { ua: "Дніпро", en: "Dnipro", coordinates: [48.4647, 35.0462] },
  { ua: "Івано-Франківськ", en: "Ivano-Frankivsk", coordinates: [48.9226, 24.7111] },
  { ua: "Полтава", en: "Poltava", coordinates: [49.5883, 34.5514] },
  { ua: "Суми", en: "Sumy", coordinates: [50.9077, 34.7981] },
  { ua: "Тернопіль", en: "Ternopil", coordinates: [49.5535, 25.5948] },
];


export function getCorrectVariantWord(count) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return "варіант";
  } else if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
  ) {
    return "варіанти";
  } else {
    return "варіантів";
  }
}

export function getCorrectType(type) {
  return sports[type] ?? { name: "Unknown", icon: "" };
}

export default function BookingPage() {
  const [searchParams, setSearchParams] = useState({
    type: null,
    searchTitleOrAddres: null,
    date: null,
    startTime: null,
    duration: null,
    city: null,
  });
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedSportType, setSelectedSportType] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [sportFild, setSportFild] = useState([]);
  const prevSearchParamsRef = useRef();
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(selectedCity.coordinates);
  const mapRef = useRef();
  const [selectedSport, setSelectedSport] = useState({
    name: "All kinds of sport",
    icon: "/src/assets/images/ManySport.png",
  });

  const areParamsEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const data = await fetchSportFild();
        setSportFild(data);
      } catch (error) {
        console.error("Помилка при завантаженні даних:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!prevSearchParamsRef.current) {
        prevSearchParamsRef.current = searchParams;
        return;
      }
      if (areParamsEqual(prevSearchParamsRef.current, searchParams)) {
        return;
      }
      setLoading(true);
      setNoResultsFound(false);
      try {
        const hasFilters = Object.values(searchParams).some((param) => param !== null);
        const data = hasFilters
          ? await fetchFilteredSportFild(searchParams)
          : await fetchSportFild();
        if (data && data.length > 0) {
          setSportFild(data);
          setNoResultsFound(false);
        } else {
          setSportFild([]);
          setNoResultsFound(true);
        }
        prevSearchParamsRef.current = searchParams;
        setCurrentPage(1);
      } catch (error) {
        console.error("Помилка при завантаженні даних:", error);
        setNoResultsFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  return (
    <div className="booking-page">
      {loading && <div className="loading-indicator">Завантаження...</div>}
      <div className="left-section">
        <CitySelector
          cities={cities}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          setSearchParams={setSearchParams}
          setMapCenter={setMapCenter}
          setCurrentPage={setCurrentPage}
          selectedSport={selectedSport}
        />
        <SearchFilters
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
          setSearchParams={setSearchParams}
          setCurrentPage={setCurrentPage}
        />
        <ResultsDisplay
          sportFild={sportFild}
          selectedSport={selectedSport}
          noResultsFound={noResultsFound}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setSelectedCourt={setSelectedCourt}
          setSelectedSportType={setSelectedSportType}
          handleShowOnMap={(coords) => setMapCenter(coords)}
        />
        {sportFild.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(sportFild.length / itemsPerPage)}
            setCurrentPage={setCurrentPage}
          />
        )}
        {selectedCourt && (
          <BookingModalChooseServices
            court={selectedCourt}
            onClose={() => setSelectedCourt(null)}
            sportType={selectedSportType}
            onConfirm={(details) => {
              setBookingDetails({ court: selectedCourt, bookingInfo: details });
              setSelectedCourt(null);
            }}
          />
        )}
        {bookingDetails && (
          <BookingModalconfirmation
            court={bookingDetails.court}
            bookingInfo={bookingDetails.bookingInfo}
            onClose={() => setBookingDetails(null)}
          />
        )}
      </div>
      <div className="right-section">
        <MapView
          mapCenter={mapCenter}
          userLocation={userLocation}
          sportFild={sportFild}
          mapRef={mapRef}
          setMapCenter={setMapCenter}
          setUserLocation={setUserLocation}
          selectedCity={selectedCity}
        />
      </div>
    </div>
  );
}

