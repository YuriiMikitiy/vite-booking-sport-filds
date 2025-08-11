import React, { useEffect, useState, useCallback, useRef } from "react";
import "./BookingPageUser.css";
import { getBookingsByUserId, cancelBookingsByBookingId } from "../../../services/sportFild";
import { sports } from "../HomaPage/InputSection/dateTime";
import BookingsList from "./BookingsList.jsx";

import MapView from "./MapViewUser.jsx";
import BookingModalDetails from "./BookingModalDetails";


export function getCorrectType(type) {
  return sports[type] ?? { name: "Unknown", icon: "" };
}

export default function BookingPageUser() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([50.4501, 30.5234]);
  const [highlightedMarker, setHighlightedMarker] = useState(null);
  const mapRef = useRef();
  const userId = localStorage.getItem("userId");

  const fetchUserBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBookingsByUserId(userId);
      setBookings(data);
      if (data.length > 0 && !userLocation) {
        setMapCenter([
          data[0].sportsField.location.latitude,
          data[0].sportsField.location.longitude,
        ]);
      }
    } catch (error) {
      console.error("Помилка при завантаженні бронювань:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [userId, userLocation]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          setMapCenter([loc.lat, loc.lng]);
        },
        (error) => {
          console.error("Помилка отримання геолокації:", error);
        }
      );
    }

    fetchUserBookings();
  }, [fetchUserBookings]);

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Ви впевнені, що хочете скасувати це бронювання?")) {
      return;
    }

    try {
      setDeletingId(bookingId);
      await cancelBookingsByBookingId(bookingId);
      await fetchUserBookings();
    } catch (error) {
      console.error("Помилка при видаленні бронювання:", error);
      alert("Не вдалося скасувати бронювання. Спробуйте ще раз.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleShowOnMap = (booking) => {
    try {
      const location = [
        booking.sportsField.location.latitude,
        booking.sportsField.location.longitude,
      ];
      setMapCenter(location);
      setHighlightedMarker(booking.id);

      setTimeout(() => {
        setHighlightedMarker(null);
      }, 60000);
    } catch (error) {
      console.error("Помилка при показі на карті:", error);
    }
  };

  if (loading) {
    return <div className="loading-indicator">Завантаження...</div>;
  }

  return (
    <div className="booking-page">
      <div className="left-section">
        <h2>Мої бронювання</h2>
        <BookingsList
          bookings={bookings}
          deletingId={deletingId}
          handleDeleteBooking={handleDeleteBooking}
          handleShowOnMap={handleShowOnMap}
          setSelectedBooking={setSelectedBooking}
        />
      </div>
      <div className="right-section">
        <MapView
          mapCenter={mapCenter}
          userLocation={userLocation}
          bookings={bookings}
          highlightedMarker={highlightedMarker}
          mapRef={mapRef}
        />
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