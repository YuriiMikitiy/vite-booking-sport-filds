import React from "react";
import { getCorrectType } from "../../utils/sportFieldType.js";
import { useContext, useState } from "react";
import { LanguageContext } from "../../assets/LanguageContext";
import ReviewForm from "../BookingPage/componentsBookingPage/ReviewForm.jsx";
import NativeMapLink from "../common/NativeMapLink.jsx";
import "../BookingPage/componentsBookingPage/CourtCard/CourtCard.css";

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

function bookingStatusLabel(raw, t) {
  const n = Number(raw);
  if (raw === null || raw === undefined || Number.isNaN(n)) return t.bookingsUser.statusUnknown;
  switch (n) {
    case 1:
      return t.bookingsUser.statusPending;
    case 2:
      return t.bookingsUser.statusConfirmed;
    case 3:
      return t.bookingsUser.statusCancelled;
    default:
      return t.bookingsUser.statusUnknown;
  }
}

const statusNum = Number(booking.status);
const isPastBooking = new Date(booking.endTime) < new Date();
/** Відгук після завершення слоту: очікує / підтверджено (1–2), не скасовано (3) */
const canLeaveReview =
  isPastBooking && (statusNum === 1 || statusNum === 2);

  return (
    <div className="court-card">
      <div className="card-image-container">
        <img
          src={
            booking.sportsField.imageUrl || "/src/assets/images/default-court.jpg"
          }
          alt={booking.sportsField.title}
          className="card-image"
        />
        <div className="image-badges">
          <span className="badge badge--plain">
            Статус: {bookingStatusLabel(booking.status, t)}
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
          <NativeMapLink
            lat={booking.sportsField?.location?.latitude}
            lng={booking.sportsField?.location?.longitude}
            label={booking.sportsField?.title}
            className="show-on-map-button-user"
            onDesktopAction={() => handleShowOnMap(booking)}
          >
            {t.courtCard.showOnMap}
          </NativeMapLink>
          <button
            className="cancel-button-my-book"
            style={{ marginLeft: "1rem" }}
            onClick={() => handleDeleteBooking(booking.id)}
            disabled={deletingId === booking.id || isPastBooking}
            title={isPastBooking ? t.bookingsUser.cancelDisabledPastTitle : ""}
          >
            {deletingId === booking.id
              ? "Скасування..."
              : isPastBooking
                ? t.bookingsUser.cancelDisabledPast
                : "Скасувати бронювання"}
          </button>
          <button
            className="book-button-details"
            onClick={() => setSelectedBooking(booking)}
          >
            Деталі бронювання
          </button>
          {canLeaveReview && (
            <button
              className="book-button-details"
              onClick={() => setShowReview((prev) => !prev)}
            >
              {showReview ? t.reviewForm.hide : t.reviewForm.leave}
            </button>
          )}
        </div>
        {showReview && canLeaveReview && (
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