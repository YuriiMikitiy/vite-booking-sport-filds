import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import "./BookingPageUser.css";
import { getBookingsByUserId, cancelBookingsByBookingId } from "../../../services/sportFild";
import BookingsList from "./BookingsList.jsx";
import { useContext } from "react";
import { LanguageContext } from "../../assets/LanguageContext.jsx";
import MapView from "./MapViewUser.jsx";
import BookingModalDetails from "./BookingModalDetails";
import Pagination from "./Pagination";   // ← переконайся, що файл існує
import { useMediaQuery } from "../../hooks/useMediaQuery.js";
import MapFullscreenModal from "../common/MapFullscreenModal.jsx";
import { buildGoogleMapsUrl } from "../../utils/mapsUrls.js";
import { useToast } from "../../context/ToastContext.jsx";

const DEFAULT_CENTER = [50.4501, 30.5234];

function formatLocalYmd(d) {
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** upcoming | todayEnded | pastEnded */
function getBookingTab(booking) {
  const now = new Date();
  const end = new Date(booking.endTime);
  const start = new Date(booking.startTime);
  if (end > now) return "upcoming";
  const todayYmd = formatLocalYmd(now);
  const startYmd = formatLocalYmd(start);
  if (startYmd === todayYmd) return "todayEnded";
  return "pastEnded";
}

export default function BookingPageUser() {
  const [allBookings, setAllBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [highlightedMarker, setHighlightedMarker] = useState(null);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const mapRef = useRef(null);
  const showInlineMap = useMediaQuery("(min-width: 901px)");

  const [filterMode, setFilterMode] = useState("upcoming"); // upcoming | todayEnded | pastEnded
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const bookingsForTab = useMemo(
    () => allBookings.filter((b) => getBookingTab(b) === filterMode),
    [allBookings, filterMode]
  );

  const { language, translations } = useContext(LanguageContext);
  const t = translations[language];
  const { showToast } = useToast();
  const userId = localStorage.getItem("userId");

  const mapExternalUrl = useMemo(
    () => buildGoogleMapsUrl(mapCenter[0], mapCenter[1]),
    [mapCenter]
  );

  // Завантаження бронювань
  const fetchUserBookings = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getBookingsByUserId(userId);
      const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllBookings(sorted);
    } catch (error) {
      console.error("Помилка завантаження бронювань:", error);
      setAllBookings([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  useEffect(() => {
    const first = allBookings.find(
      (b) =>
        b.sportsField?.location?.latitude != null &&
        b.sportsField?.location?.longitude != null
    );
    if (first) {
      setMapCenter([
        first.sportsField.location.latitude,
        first.sportsField.location.longitude,
      ]);
    }
  }, [allBookings]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    setFilteredBookings(
      bookingsForTab.slice(startIndex, startIndex + itemsPerPage)
    );
  }, [bookingsForTab, currentPage]);

  const totalPages = Math.ceil(bookingsForTab.length / itemsPerPage);

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm(t.bookingsUser.confirmCancel)) return;

    try {
      setDeletingId(bookingId);
      await cancelBookingsByBookingId(bookingId);
      await fetchUserBookings();
      setCurrentPage(1); // повертаємося на першу сторінку після видалення
    } catch (error) {
      console.error("Помилка скасування:", error);
      showToast(t.bookingsUser.cancelError, "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleShowOnMap = (booking) => {
    const lat = booking.sportsField?.location?.latitude;
    const lng = booking.sportsField?.location?.longitude;
    if (lat == null || lng == null) return;
    setMapCenter([lat, lng]);
    setHighlightedMarker(booking.id);
    if (!showInlineMap) {
      setMapModalOpen(true);
    }
  };

  return (
    <div className="booking-page">
      <div className="left-section">
        <h2>{t.bookingsUser.myBookings}</h2>

        <div className="filter-container" role="tablist" aria-label={t.bookingsUser.myBookings}>
          <button
            type="button"
            role="tab"
            aria-selected={filterMode === "pastEnded"}
            className={`filter-btn ${filterMode === "pastEnded" ? "active" : ""}`}
            onClick={() => {
              setFilterMode("pastEnded");
              setCurrentPage(1);
            }}
          >
            {t.bookingsUser.filterPastEnded}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filterMode === "todayEnded"}
            className={`filter-btn ${filterMode === "todayEnded" ? "active" : ""}`}
            onClick={() => {
              setFilterMode("todayEnded");
              setCurrentPage(1);
            }}
          >
            {t.bookingsUser.filterTodayEnded}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filterMode === "upcoming"}
            className={`filter-btn ${filterMode === "upcoming" ? "active" : ""}`}
            onClick={() => {
              setFilterMode("upcoming");
              setCurrentPage(1);
            }}
          >
            {t.bookingsUser.filterUpcoming}
          </button>
        </div>

        <BookingsList
          bookings={filteredBookings}
          tabEmptyMessage={
            allBookings.length > 0 && bookingsForTab.length === 0
              ? t.bookingsUser.noInThisTab
              : null
          }
          deletingId={deletingId}
          handleDeleteBooking={handleDeleteBooking}
          handleShowOnMap={handleShowOnMap}
          setSelectedBooking={setSelectedBooking}
          onReviewAdded={fetchUserBookings}
        />

        {/* Пагінація — приклеєна знизу */}
{totalPages > 1 && bookingsForTab.length > 0 && (
  <div className="pagination-wrapper">
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      setCurrentPage={setCurrentPage}
    />
  </div>
)}
      </div>

      <div className={`right-section${showInlineMap ? "" : " right-section--compact-map"}`}>
        {showInlineMap && (
          <MapView
            mapCenter={mapCenter}
            userLocation={null}
            bookings={allBookings}
            highlightedMarker={highlightedMarker}
            mapRef={mapRef}
          />
        )}
        {!showInlineMap && (
          <>
            <div className="map-mobile-card" role="region" aria-label={t.map.userMapTitle}>
              <p className="map-mobile-card__hint">{t.map.hint}</p>
              <button
                type="button"
                className="map-mobile-card__btn"
                onClick={() => setMapModalOpen(true)}
              >
                {t.map.openMap}
              </button>
            </div>
            {mapModalOpen && (
              <MapFullscreenModal
                title={t.map.userMapTitle}
                onClose={() => setMapModalOpen(false)}
                externalUrl={mapExternalUrl}
                externalLabel={t.map.openInMaps}
                closeLabel={t.map.close}
              >
                <MapView
                  mapCenter={mapCenter}
                  userLocation={null}
                  bookings={allBookings}
                  highlightedMarker={highlightedMarker}
                  mapRef={mapRef}
                />
              </MapFullscreenModal>
            )}
          </>
        )}
      </div>

      {selectedBooking && (
        <BookingModalDetails
          court={selectedBooking.sportsField}
          bookingInfo={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}




// import React, { useEffect, useState, useCallback, useRef } from "react";
// import "./BookingPageUser.css";
// import { getBookingsByUserId, cancelBookingsByBookingId } from "../../../services/sportFild";
// import { sports } from "../HomaPage/InputSection/dateTime";
// import BookingsList from "./BookingsList.jsx";
// import { useContext } from "react";
// import { LanguageContext } from "../../assets/LanguageContext.jsx";

// import MapView from "./MapViewUser.jsx";
// import BookingModalDetails from "./BookingModalDetails";


// export function getCorrectType(type) {
//   return sports[type] ?? { name: "Unknown", icon: "" };
// }

// export default function BookingPageUser() {
//   const [bookings, setBookings] = useState([]);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [mapCenter, setMapCenter] = useState([50.4501, 30.5234]);
//   const [highlightedMarker, setHighlightedMarker] = useState(null);
//   const mapRef = useRef();
//   const userId = localStorage.getItem("userId");

//   const { language, setLanguage, translations } = useContext(LanguageContext);
//   const t = translations[language];

//   const fetchUserBookings = useCallback(async () => {
//   try {
//     setLoading(true);
//     const data = await getBookingsByUserId(userId);

//     const sortedBookings = [...data].sort(
//       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//     );

//     setBookings(sortedBookings);

//     if (sortedBookings.length > 0 && !userLocation) {
//       setMapCenter([
//         sortedBookings[0].sportsField.location.latitude,
//         sortedBookings[0].sportsField.location.longitude,
//       ]);
//     }
//   } catch (error) {
//     console.error("Помилка при завантаженні бронювань:", error);
//     setBookings([]);
//   } finally {
//     setLoading(false);
//   }
// }, [userId, userLocation]);


//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const loc = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setUserLocation(loc);
//           setMapCenter([loc.lat, loc.lng]);
//         },
//         (error) => {
//           console.error("Помилка отримання геолокації:", error);
//         }
//       );
//     }

//     fetchUserBookings();
//   }, [fetchUserBookings]);

//   const handleDeleteBooking = async (bookingId) => {
//     if (!window.confirm(t.bookingsUser.confirmCancel)) {
//       return;
//     }

//     try {
//       setDeletingId(bookingId);
//       await cancelBookingsByBookingId(bookingId);
//       await fetchUserBookings();
//     } catch (error) {
//       console.error("Помилка при видаленні бронювання:", error);
//       alert(t.bookingsUser.cancelError);
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const handleShowOnMap = (booking) => {
//     try {
//       const location = [
//         booking.sportsField.location.latitude,
//         booking.sportsField.location.longitude,
//       ];
//       setMapCenter(location);
//       setHighlightedMarker(booking.id);

//       setTimeout(() => {
//         setHighlightedMarker(null);
//       }, 60000);
//     } catch (error) {
//       console.error("Помилка при показі на карті:", error);
//     }
//   };

//   if (loading) {
//     return <div className="loading-indicator">{t.bookingsUser.loading}</div>;
//   }

//   return (
//     <div className="booking-page">
//       <div className="left-section">
//         <h2>{t.bookingsUser.myBookings}</h2>
//         <BookingsList
//           bookings={bookings}
//           deletingId={deletingId}
//           handleDeleteBooking={handleDeleteBooking}
//           handleShowOnMap={handleShowOnMap}
//           setSelectedBooking={setSelectedBooking}
//           onReviewAdded={fetchUserBookings}
//         />
//       </div>
//       <div className="right-section">
//         <MapView
//           mapCenter={mapCenter}
//           userLocation={userLocation}
//           bookings={bookings}
//           highlightedMarker={highlightedMarker}
//           mapRef={mapRef}
//         />
//       </div>
//       {selectedBooking && (
//         <BookingModalDetails
//           court={selectedBooking.sportsField}
//           bookingInfo={selectedBooking}
//           onClose={() => setSelectedBooking(null)}
//         />
//       )}
//     </div>
//   );
// }