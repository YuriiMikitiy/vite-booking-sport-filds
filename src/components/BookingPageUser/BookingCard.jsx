import React from "react";
import { getCorrectType } from "../BookingPage/BookingPage.jsx";
import { useContext, useState } from "react";
import { LanguageContext } from "../../assets/LanguageContext";
import ReviewForm from "../BookingPage/componentsBookingPage/ReviewForm.jsx";

export default function BookingCard({
  booking,
  deletingId,
  handleDeleteBooking,
  handleShowOnMap,
  setSelectedBooking,
  onReviewAdded,
}) {
const { language, translations } = useContext(LanguageContext);
const t = translations[language];
const [showReview, setShowReview] = useState(false);

// Функція для отримання перекладеної назви спорту для тегів
  const getTranslatedSportName = (typeId) => {
    const sportInfo = getCorrectType(typeId);
    if (!sportInfo) return "Спорт";

    const mapping = {
      "Tennis": "tennis",
      "Badminton": "badminton",
      "Football field": "footballField",
      "Box": "box",
      "Ping Pong": "pingPong",
      "Biliard": "biliard",
      "Basketball": "basketball"
    };

    const translationKey = mapping[sportInfo.key];
    return t.sports[translationKey] || sportInfo.key;
  };

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
const status = Number(booking.status);
const canReview = status === 1 || status === 2;
const isPastBooking = new Date(booking.endTime) < new Date();

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
          {console.log("BOOKING:", booking.sportsField)}
  {booking.sportsField.types?.map((sportType, index) => {
    const sportInfo = getCorrectType(sportType.type);
    return (
      <span className="tag" key={index}>
        <img
          src={sportInfo?.icon || "/src/assets/images/default-sport.png"}
          alt={sportInfo?.name}
          width="20"
        />
        {getTranslatedSportName(sportType.type)}
      </span>
    );
  })}
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
            disabled={deletingId === booking.id || isPastBooking}
            title={isPastBooking ? "Бронювання вже завершене" : ""}
          >
            {deletingId === booking.id
              ? "Скасування..."
              : isPastBooking
                ? "Бронювання завершено"
                : "Скасувати бронювання"}
          </button>
          <button
            className="book-button-details"
            onClick={() => setSelectedBooking(booking)}
          >
            Деталі бронювання
          </button>
          {canReview && (
            <button
              className="book-button-details"
              onClick={() => setShowReview((prev) => !prev)}
            >
              {showReview ? t.reviewForm.hide : t.reviewForm.leave}
            </button>
          )}
        </div>
        {showReview && (
          <ReviewForm
            sportsFieldId={booking.sportsField.id}
            bookingId={booking.id}
            onReviewAdded={onReviewAdded}
            onClose={() => setShowReview(false)}
          />
        )}
      </div>
    </div>
  );
}