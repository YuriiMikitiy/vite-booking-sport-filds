import React, { useEffect, useState, useRef } from "react";
import "./BookingPage.css";
import "./BookingModalconfirmation.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CustomDropdown from "../HomaPage/InputSection/CustomDropdown.jsx";
import BookingModalconfirmation from "./BookingModalconfirmation";
import BookingModalChooseServices from "./BookingModalChoseServices.jsx";
import CourtCard from "../BookingPage/componentsBookingPage/CourtCard/CourtCard.jsx";

// Fix for default marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import {
  timeOptions,
  durationOptions,
  sports,
} from "../HomaPage/InputSection/dateTime";
import {
  fetchSportFild,
  fetchFilteredSportFild,
} from "../../../services/sportFild.js";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const cities = [
  { ua: "Усі міста", en: null, coordinates: [50.4501, 30.5234] },
  { ua: "Київ", en: "Kyiv", coordinates: [50.4501, 30.5234] },
  { ua: "Львів", en: "Lviv", coordinates: [49.8397, 24.0297] },
  { ua: "Одеса", en: "Odesa", coordinates: [46.4825, 30.7233] },
  { ua: "Харків", en: "Kharkiv", coordinates: [49.9935, 36.2304] },
  { ua: "Дніпро", en: "Dnipro", coordinates: [48.4647, 35.0462] },
  {
    ua: "Івано-Франківськ",
    en: "Ivano-Frankivsk",
    coordinates: [48.9226, 24.7111],
  },
  { ua: "Полтава", en: "Poltava", coordinates: [49.5883, 34.5514] },
  { ua: "Суми", en: "Sumy", coordinates: [50.9077, 34.7981] },
  { ua: "Тернопіль", en: "Ternopil", coordinates: [49.5535, 25.5948] },
];

function getCorrectVariantWord(count) {
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

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
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
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [sportFild, setSportFild] = useState([]);
  const prevSearchParamsRef = useRef();
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [selectWidth, setSelectWidth] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(selectedCity.coordinates);
  const mapRef = useRef();

  const [selectedSport, setSelectedSport] = useState({
    name: "All kinds of sport",
    icon: "/src/assets/images/ManySport.png",
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sportFild.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sportFild.length / itemsPerPage);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
          // If no user location and there are bookings, use first booking's location
          if (sportFild.length > 0) {
            setMapCenter([
              sportFild[0].location.latitude,
              sportFild[0].location.longitude,
            ]);
          } else {
            // Otherwise use selected city's coordinates
            setMapCenter(selectedCity.coordinates);
          }
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      // If no geolocation support and there are bookings, use first booking's location
      if (sportFild.length > 0) {
        setMapCenter([
          sportFild[0].location.latitude,
          sportFild[0].location.longitude,
        ]);
      }
    }
  }, [sportFild, selectedCity]);

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

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 4;
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

  const areParamsEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
    setIsOpen(false);
    const sportType =
      sport.name === "All kinds of sport"
        ? null
        : sports.findIndex((s) => s.name === sport.name);
    setSearchParams((prev) => ({ ...prev, type: sportType }));
    setCurrentPage(1);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value.trim();
    setSearchParams((prev) => ({
      ...prev,
      searchTitleOrAddres: value || null,
    }));
    setCurrentPage(1);
  };

  const handleDateSelect = (e) => {
    const value = e.target.value || null;
    setSearchParams((prev) => ({ ...prev, date: value }));
    setCurrentPage(1);
  };

  const handleTimeSelect = (value) => {
    setSearchParams((prev) => ({ ...prev, startTime: value || null }));
    setCurrentPage(1);
  };

  const handleDurationSelect = (value) => {
    setSearchParams((prev) => ({ ...prev, duration: value || null }));
    setCurrentPage(1);
  };

  const handleCitySelect = (uaCity) => {
    const selected = cities.find((city) => city.ua === uaCity);
    if (selected) {
      setSelectedCity(selected);
      setSearchParams((prev) => ({ ...prev, city: selected.en }));
      setCurrentPage(1);
      setMapCenter(selected.coordinates);
    }
  };

  const measureText = (text) => {
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.whiteSpace = "nowrap";
    span.style.fontWeight = "bold";
    span.style.fontSize = window.getComputedStyle(
      document.querySelector(".city-select")
    ).fontSize;
    span.innerText = text;
    document.body.appendChild(span);
    const width = span.offsetWidth + 30;
    document.body.removeChild(span);
    return width;
  };

  const handleShowOnMap = (coordinates) => {
    setMapCenter(coordinates);
    if (mapRef.current) {
      mapRef.current.setView(coordinates, 15);
    }
  };

  useEffect(() => {
    setSelectWidth(measureText(selectedCity.ua));
  }, [selectedCity.ua]);

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
        const hasFilters = Object.values(searchParams).some(
          (param) => param !== null
        );
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

  return (
    <div className="booking-page">
      {loading && <div className="loading-indicator">Завантаження...</div>}

      <div className="left-section">
        <h2>
          <img
            src={
              getCorrectType(sportFild.type)?.icon ||
              "/src/assets/images/default-sport.png"
            }
            alt={selectedSport.name}
            width="30"
          />
          {sportFild.title} в м.&nbsp;
          <select
            value={selectedCity.ua}
            onChange={(e) => handleCitySelect(e.target.value)}
            className="city-select"
            style={{ "--select-width": `${selectWidth}px` }}
          >
            {cities.map((city) => (
              <option key={city.en} value={city.ua}>
                {city.ua}
              </option>
            ))}
          </select>
        </h2>

        <div className="search-fields">
          <div className="select-container" style={{ marginLeft: "12px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative",
                paddingRight: "20px",
                width: "100%",
              }}
              className="select-box"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={
                    selectedSport.icon || "/src/assets/images/default-sport.png"
                  }
                  alt={selectedSport.name}
                  className="selected-icon"
                />
                <span>{selectedSport.name}</span>
              </div>
              <span style={{ position: "absolute", right: "20px" }}>▼</span>
            </div>
            <ul className={`select-dropdown ${isOpen ? "show" : ""}`}>
              <li
                onClick={() => {
                  handleSportSelect({
                    name: "All kinds of sport",
                    icon: "/src/assets/images/ManySport.png",
                  });
                }}
              >
                <img src="/src/assets/images/ManySport.png" alt="ManySport" />
                All kinds of sport
              </li>
              {sports.map((sport, index) => (
                <li
                  key={index}
                  onClick={() => {
                    handleSportSelect(sport);
                    setIsOpen(false);
                  }}
                >
                  <img
                    src={sport.icon || "/src/assets/images/default-sport.png"}
                    alt={sport.name}
                  />{" "}
                  {sport.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="select-container-date">
            <input
              type="date"
              className="date-input"
              placeholder="Select date"
              onChange={handleDateSelect}
            />
          </div>

          <CustomDropdown
            options={timeOptions}
            placeholder="Оберіть час"
            onSelect={handleTimeSelect}
          />
          <CustomDropdown
            options={durationOptions}
            placeholder="Оберіть тривалість"
            onSelect={handleDurationSelect}
          />
        </div>

        <input
          className="search-input"
          type="text"
          placeholder="Пошук"
          onChange={handleSearchInput}
        />

        {noResultsFound ? (
          <div className="no-results-message">
            <h3>Нічого не знайдено</h3>
            <p>Спробуйте змінити параметри пошуку</p>
          </div>
        ) : (
          <>
            <p className="results-count">
              Ми знайшли {sportFild.length}{" "}
              {getCorrectVariantWord(sportFild.length)}
            </p>

            <CourtCard
              courts={currentItems}
              selectedSport={selectedSport}
              setSelectedCourt={setSelectedCourt}
              setSelectedSportType={setSelectedSportType}
              handleShowOnMap={handleShowOnMap}
            />
            {/* <div style={{ marginBottom: "50px" }}>
              {currentItems.map((court) => (
                <div className="card" key={court.id}>
                  <div className="card-image-container">
                    <img
                      src={
                        court.imageUrl || "/src/assets/images/default-court.jpg"
                      }
                      alt={court.title}
                      className="card-image"
                    />
                    <div className="image-badges">
                      <span className="badge red">❤️ Без комісії</span>
                      <span className="badge yellow">⚡ Онлайн</span>
                    </div>
                  </div>
                  <div className="card-info">
                    <h3>{court.title}</h3>
                    <p>{court.location.address}</p>
                    <div className="tags">
                      <span className="tag">
                        <img
                          src={
                            getCorrectType(court.type)?.icon ||
                            "/src/assets/images/default-sport.png"
                          }
                          alt={selectedSport.name}
                          width="20"
                        />{" "}
                        {getCorrectType(court.type)?.name || "Спорт"}
                      </span>
                    </div>
                    {court.warningInformation && (
                      <p className="warning">⚠️{court.warningInformation}</p>
                    )}
                    <p className="description">
                      У цьому клубі можна забронювати корт менше ніж за 1
                      хвилину
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <button
                        className="book-button highlight"
                        onClick={() => {
                          setSelectedCourt(court);
                          setSelectedSportType(selectedSport.name);
                        }}
                      >
                        ⚡ Забронювати майданчик у кілька кліків тут →{" "}
                        <div
                          style={{
                            backgroundColor: "Blue",
                            padding: "8px",
                            borderRadius: "15px",
                            margin: "0px",
                          }}
                        >
                          Забронювати
                        </div>
                      </button>
                      <button
                        className="show-on-map-button"
                        onClick={() =>
                          handleShowOnMap([
                            court.location.latitude,
                            court.location.longitude,
                          ])
                        }
                      >
                        Показати на карті
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div> */}

            {sportFild.length > itemsPerPage && (
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
                    onClick={() => goToPage(number)}
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
            )}
          </>
        )}

        {selectedCourt && (
          <BookingModalChooseServices
            court={selectedCourt}
            onClose={() => setSelectedCourt(null)}
            sportType={selectedSportType}
            onConfirm={(details) => {
              setBookingDetails({
                court: selectedCourt,
                bookingInfo: details,
              });
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
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{
            height: "550px",
            width: "500px",
            marginLeft: "42px",
            borderRadius: "15px",
            marginTop: "24px",
          }}
          whenCreated={(map) => {
            mapRef.current = map;
          }}
          key={`${mapCenter[0]}-${mapCenter[1]}`}
        >
          <ChangeView center={mapCenter} zoom={13} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>Ваше поточне місцезнаходження</Popup>
            </Marker>
          )}
          {sportFild.map((court) => (
            <Marker
              position={[court.location.latitude, court.location.longitude]}
              key={court.id}
            >
              <Popup>
                <b>{court.title}</b>
                <br />
                {court.location.address}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
