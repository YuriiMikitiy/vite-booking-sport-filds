import React, { useEffect, useState, useCallback, useRef } from "react";
import "./BookingPageUser.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import BookingModalDetails from "../BookingPageUser/BookingModalDetails";
import { deleteBookingsByBookingId } from "../../../services/sportFild";

// Fix for default marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { sports } from "../HomaPage/InputSection/dateTime";
import { getBookingsByUserId } from "../../../services/sportFild";

// Додамо кастомний маркер для підсвічування
const highlightedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function getCorrectType(type) {
  return sports[type] ?? { name: "Unknown", icon: "" };
}

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Компонент для безпечного відображення маркерів
const SafeMarker = ({ position, children, highlighted }) => {
  const markerRef = useRef();

  useEffect(() => {
    const marker = markerRef.current;
    if (marker && highlighted) {
      marker.setIcon(highlightedIcon);
    } else if (marker && !highlighted) {
      marker.setIcon(L.Icon.Default.prototype);
    }
  }, [highlighted]);

  return position ? (
    <Marker position={position} ref={markerRef}>
      {children}
    </Marker>
  ) : null;
};

export default function BookingPageUser() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([50.4501, 30.5234]);
  const [highlightedMarker, setHighlightedMarker] = useState(null);
  const mapRef = useRef();
  const userId = localStorage.getItem('userId');

  const fetchUserBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBookingsByUserId(userId);
      setBookings(data);
      if (data.length > 0 && !userLocation) {
        setMapCenter([
          data[0].sportsField.location.latitude,
          data[0].sportsField.location.longitude
        ]);
      }
    } catch (error) {
      console.error('Помилка при завантаженні бронювань:', error);
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
            lng: position.coords.longitude
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
    if (!window.confirm('Ви впевнені, що хочете скасувати це бронювання?')) {
      return;
    }

    try {
      setDeletingId(bookingId);
      await deleteBookingsByBookingId(bookingId);
      await fetchUserBookings();
    } catch (error) {
      console.error('Помилка при видаленні бронювання:', error);
      alert('Не вдалося скасувати бронювання. Спробуйте ще раз.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleShowOnMap = (booking) => {
    try {
      const location = [
        booking.sportsField.location.latitude,
        booking.sportsField.location.longitude
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

        {bookings.length === 0 ? (
          <div className="no-results-message">
            <h3>У вас немає активних бронювань</h3>
            <p>Скористайтесь пошуком, щоб знайти майданчик для гри</p>
          </div>
        ) : (
          <div style={{ marginBottom: '50px' }}>
            {bookings.map((booking) => (
              <div className="card-user" key={booking.id}>
                <div className="card-image-container">
                  <img
                    src={booking.sportsField.imageUrl || "/src/assets/images/default-court.jpg"}
                    alt={booking.sportsField.title}
                    className="card-image"
                  />
                  <div className="image-badges">
                    <span className="badge">Статус: {booking.status === 2 ? "Підтверджено" : "Очікує підтвердження"}</span>
                  </div>
                </div>
                <div className="card-info">
                  <h3>{booking.sportsField.title}</h3>
                  <p>Дата: {new Date(booking.startTime).toLocaleDateString()}</p>
                  <p>Час: {new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}</p>
                  <p>Ціна: {booking.totalPrice} грн</p>
                  <div className="tags">
                    <span className="tag">
                      <img
                        src={getCorrectType(booking.sportsField.type)?.icon || "/src/assets/images/default-sport.png"}
                        alt={getCorrectType(booking.sportsField.type)?.name}
                        width="20"
                      />{" "}
                      {getCorrectType(booking.sportsField.type)?.name || "Спорт"}
                    </span>
                  </div>
                  {booking.comment && <p className="comment">Коментар: {booking.comment}</p>}
                  <div className="booking-actions">
                    <button
                      className="show-on-map-button-user"
                      onClick={() => handleShowOnMap(booking)}
                    >
                      Показати на карті
                    </button>
                    <button
                      className="cancel-button"
                      style={{marginLeft: '1rem'}}
                      onClick={() => handleDeleteBooking(booking.id)}
                      disabled={deletingId === booking.id}
                    >
                      {deletingId === booking.id ? 'Скасування...' : 'Скасувати бронювання'}
                    </button>
                    <button
                      className="book-button-details"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      Деталі бронювання
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
          whenCreated={(map) => { mapRef.current = map; }}
        >
          <ChangeView center={mapCenter} zoom={13} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {userLocation && (
            <SafeMarker position={[userLocation.lat, userLocation.lng]}>
              <Popup>Ваше поточне місцезнаходження</Popup>
            </SafeMarker>
          )}
          
          {bookings.map((booking) => (
            <SafeMarker 
              key={booking.id}
              position={[
                booking.sportsField.location.latitude,
                booking.sportsField.location.longitude
              ]}
              highlighted={highlightedMarker === booking.id}
            >
              <Popup>
                <b>{booking.sportsField.title}</b>
                <br />
                {new Date(booking.startTime).toLocaleDateString()} {new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}
              </Popup>
            </SafeMarker>
          ))}
        </MapContainer>
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