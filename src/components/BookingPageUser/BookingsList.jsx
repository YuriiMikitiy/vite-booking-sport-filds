import React, { useContext } from "react";
import { LanguageContext } from "../../assets/LanguageContext";
import BookingCard from "./BookingCard.jsx";

export default function BookingsList({
  bookings,
  tabEmptyMessage,
  deletingId,
  handleDeleteBooking,
  handleShowOnMap,
  setSelectedBooking,
  onReviewAdded,
}) {
  const { language, translations } = useContext(LanguageContext);
  const t = translations[language];

  return bookings.length === 0 ? (
    <div className="no-results-message">
      <h3>{tabEmptyMessage ?? t.bookingsUser.noBookings}</h3>
      {!tabEmptyMessage && <p>{t.bookingsUser.useSearch}</p>}
    </div>
  ) : (
    <div className="bookings-list-stack">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          deletingId={deletingId}
          handleDeleteBooking={handleDeleteBooking}
          handleShowOnMap={handleShowOnMap}
          setSelectedBooking={setSelectedBooking}
          onReviewAdded={onReviewAdded}
        />
      ))}
    </div>
  );
}