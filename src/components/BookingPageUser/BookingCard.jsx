import React from "react";
import { getCorrectType } from "./BookingPageUser.jsx";

export default function BookingCard({
  booking,
  deletingId,
  handleDeleteBooking,
  handleShowOnMap,
  setSelectedBooking,
}) {

const correctStatus = (type) => {
  switch (type) {
    case 1:
      return "Очікує підтвердження";
    case 2:
      return "Підтверджено";
    case 3:
      return "Скасовано";
    default:
      break;
  }
}
  return (
    <div className="card-user">
      <div className="card-image-container">
        <img
          src={
            booking.sportsField.imageUrl || "/src/assets/images/default-court.jpg"
          }
          alt={booking.sportsField.title}
          className="card-image"
        />
        <div className="image-badges">
          <span className="badge">
            Статус: {correctStatus(booking.status) }
          </span>
        </div>
      </div>
      <div className="card-info">
        <h3>{booking.sportsField.title}</h3>
        <p>Дата: {new Date(booking.startTime).toLocaleDateString()}</p>
        <p>
          Час: {new Date(booking.startTime).toLocaleTimeString()} -{" "}
          {new Date(booking.endTime).toLocaleTimeString()}
        </p>
        <p>Ціна: {booking.totalPrice} грн</p>
        <div className="tags">
          <span className="tag">
            <img
              src={
                getCorrectType(booking.sportsField.type)?.icon ||
                "/src/assets/images/default-sport.png"
              }
              alt={getCorrectType(booking.sportsField.type)?.name}
              width="20"
            />{" "}
            {getCorrectType(booking.sportsField.type)?.name || "Спорт"}
          </span>
        </div>
        
        <div className="booking-actions">
          <button
            className="show-on-map-button-user"
            onClick={() => handleShowOnMap(booking)}
          >
            Показати на карті
          </button>
          <button
            className="cancel-button-my-book"
            style={{ marginLeft: "1rem" }}
            onClick={() => handleDeleteBooking(booking.id)}
            disabled={deletingId === booking.id}
          >
            {deletingId === booking.id ? "Скасування..." : "Скасувати бронювання"}
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
  );
}