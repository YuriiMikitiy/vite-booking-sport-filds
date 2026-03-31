import React, { useContext } from "react";
import { LanguageContext } from "../../assets/LanguageContext";
import BookingCard from "./BookingCard.jsx";

export default function BookingsList({
  bookings,
  deletingId,
  handleDeleteBooking,
  handleShowOnMap,
  setSelectedBooking,
}) {
  const { language, translations } = useContext(LanguageContext);
  const t = translations[language];

  return bookings.length === 0 ? (
    <div className="no-results-message">
      <h3>{t.bookingsUser.noBookings}</h3>
      <p>{t.bookingsUser.useSearch}</p>
    </div>
  ) : (
    <div style={{ marginBottom: "50px" }}>
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          deletingId={deletingId}
          handleDeleteBooking={handleDeleteBooking}
          handleShowOnMap={handleShowOnMap}
          setSelectedBooking={setSelectedBooking}
        />
      ))}
    </div>
  );
}