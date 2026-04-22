import React, { useEffect, useRef } from "react";
import "../BookingPage/BookingModalconfirmation.css";
import { sports } from "../HomaPage/InputSection/dateTime";
import { useModalBodyLock } from "../../hooks/useModalBodyLock.js";

function getCorrectType(type) {
  return sports[type] ?? { name: "Unknown", icon: "" };
}

export default function BookingModalconfirmation({ court, bookingInfo, onClose }) {
  const modalRef = useRef();
  useModalBodyLock(true);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    function handleEscape(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const startTime = new Date(bookingInfo.startTime);
  const endTime = new Date(bookingInfo.endTime);
  const formatTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  console.log("details:", bookingInfo)

  return (
    <div className="app-modal-overlay">
      <div className="app-modal-panel" ref={modalRef}>
        <h2 className="app-modal-title">Підтвердження бронювання</h2>
        <h3>{bookingInfo.court || bookingInfo.title}</h3>
        <p><strong>Локація:</strong> {bookingInfo.sportsField.location?.address || bookingInfo.location}</p>
        <p>
  <strong>Вид спорту:</strong>{" "}
  {court.types?.length > 0
    ? getCorrectType(court.types[0].type)?.key
    : "Не вказано"}
    
</p>
        <p><strong>Час:</strong> {formatTime(startTime)} - {formatTime(endTime)}</p>
        <p><strong>Вартість:</strong> {bookingInfo.totalPrice} грн</p>
        <p><strong>Коментар:</strong> {bookingInfo.comment ? bookingInfo.comment : "Коментаря немає"}</p>
        <p className="notice">Клуб може змінити вартість послуги</p>

        

        <div className="app-modal-actions">
          <button type="button" className="app-modal-btn app-modal-btn--primary app-modal-btn--block" onClick={onClose}>Закрити</button>
        </div>
      </div>
    </div>
  );
}
