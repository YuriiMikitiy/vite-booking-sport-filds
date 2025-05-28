import React, { useEffect, useRef } from "react";
import "../BookingPage/BookingModalconfirmation.css";
import { sports } from "../HomaPage/InputSection/dateTime";

function getCorrectType(type) {
  return sports[type] ?? { name: "Unknown", icon: "" };
}

export default function BookingModalconfirmation({ court, bookingInfo, onClose }) {
  const modalRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const startTime = new Date(bookingInfo.startTime);
  const endTime = new Date(bookingInfo.endTime);
  const formatTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  console.log("details:", bookingInfo)

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h2>Підтвердження бронювання</h2>
        <h3>{bookingInfo.court || bookingInfo.title}</h3>
        <p><strong>Локація:</strong> {bookingInfo.sportsField.location?.address || bookingInfo.location}</p>
        <p><strong>Вид спорту:</strong> {getCorrectType(court.type).name}</p>
        <p><strong>Час:</strong> {formatTime(startTime)} - {formatTime(endTime)}</p>
        <p><strong>Вартість:</strong> {bookingInfo.totalPrice} грн</p>
        <p className="notice">Клуб може змінити вартість послуги</p>

        <div className="modal-buttons">
          <button className="confirm-button" onClick={onClose}>Закрити</button>
        </div>
      </div>
    </div>
  );
}
