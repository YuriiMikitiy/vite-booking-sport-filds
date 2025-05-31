import React from "react";
import BookingCard from "./BookingCard.jsx";

export default function BookingsList({
  bookings,
  deletingId,
  handleDeleteBooking,
  handleShowOnMap,
  setSelectedBooking,
}) {
  return bookings.length === 0 ? (
    <div className="no-results-message">
      <h3>У вас немає активних бронювань</h3>
      <p>Скористайтесь пошуком, щоб знайти майданчик для гри</p>
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