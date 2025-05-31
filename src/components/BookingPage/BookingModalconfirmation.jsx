import React, { useEffect, useRef, useState } from "react";
import "./BookingModalconfirmation.css";
import axios from "axios";
import { sports } from "../HomaPage/InputSection/dateTime";

function getCorrectType(type) {
  return sports[type] ?? { name: "Unknown", icon: "" };
}

export default function BookingModalconfirmation({ court, bookingInfo, onClose }) {
  const modalRef = useRef();
  const [phone, setPhone] = useState("+380");
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isTimeValid, setIsTimeValid] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const id = localStorage.getItem('userId');
    setIsLoggedIn(loggedIn);
    setUserId(id);
  }, []);

  // Fetch booked time slots for the selected court and date
  useEffect(() => {
    async function fetchBookedSlots() {
      try {
        const response = await axios.get(
          `https://localhost:44313/api/Booking/bookings/${court.id}/${bookingInfo.date}`,
          {
            headers: {
              "Accept": "application/json"
            }
          }
        );
        setBookedSlots(response.data || []);
      } catch (err) {
        console.error("Error fetching booked slots:", err);
        setError("Не вдалося завантажити інформацію про бронювання");
      }
    }

    if (court.id && bookingInfo.date) {
      fetchBookedSlots();
    }
  }, [court.id, bookingInfo.date]);

  // Handle click outside to close modal
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

  // Validate selected time
  useEffect(() => {
    const selectedDateTime = new Date(`${bookingInfo.date}T${bookingInfo.time}:00`);
    const now = new Date();

    // Check if selected time is in the past
    if (selectedDateTime < now) {
      setIsTimeValid(false);
      setError("Ви не можете вибрати час у минулому");
      return;
    }

    // Check if selected time slot is already booked
    const isSlotBooked = bookedSlots.some(slot => {
      const slotStart = new Date(slot.startTime);
      const slotEnd = new Date(slotStart.getTime() + slot.durationMinutes * 60 * 1000);
      const selectedEnd = new Date(selectedDateTime.getTime() + bookingInfo.duration * 60 * 60 * 1000);

      return (
        selectedDateTime < slotEnd &&
        selectedEnd > slotStart
      );
    });

    if (isSlotBooked) {
      setIsTimeValid(false);
      setError("Обраний час уже заброньовано");
    } else {
      setIsTimeValid(true);
      if (error === "Обраний час уже заброньовано" || error === "Ви не можете вибрати час у минулому") {
        setError(null);
      }
    }
  }, [bookingInfo.date, bookingInfo.time, bookingInfo.duration, bookedSlots, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!isLoggedIn) {
        // Guest validation
        if (!phone.startsWith("+380") || phone.length !== 13) {
          throw new Error("Телефон повинен починатися з +380 і мати 12 цифр");
        }
        if (!name.trim()) {
          throw new Error("Будь ласка, введіть ваше ім'я");
        }
      }

      // const startTime = new Date(`${bookingInfo.date}T${bookingInfo.time}:00`);
      // if (isNaN(startTime.getTime())) {
      //   throw new Error("Некоректна дата або час");
      // }

      const startTime = new Date(`${bookingInfo.date}T${bookingInfo.time}:00Z`);
    if (isNaN(startTime.getTime())) {
      throw new Error("Некоректна дата або час");
    }

      if (!isTimeValid) {
        throw new Error("Обраний час недоступний");
      }

      // Create booking object based on login status
      const bookingData = isLoggedIn
        ? {
            sportFieldId: court.id,
            comment: comment || null,
            startTime: startTime.toISOString(),
            durationMinutes: bookingInfo.duration * 60,
            totalPrice: bookingInfo.totalPrice,
            userId: userId
          }
        : {
            sportFieldId: court.id,
            comment: comment || null,
            startTime: startTime.toISOString(),
            durationMinutes: bookingInfo.duration * 60,
            totalPrice: bookingInfo.totalPrice,
            fullName: name.trim(),
            phoneNumber: phone
          };


          console.log("Sending to API:", {
  sportsFieldId: court.id,
  startTime: startTime.toISOString(),
  durationMinutes: bookingInfo.duration * 60,
  totalPrice: bookingInfo.totalPrice

});

      const endpoint = isLoggedIn
        ? "https://localhost:44313/api/Booking/bookings"
        : "https://localhost:44313/api/Booking/bookings/guest";

      await axios.post(endpoint, bookingData, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });

      onClose();
      // Add success notification here if needed
    } catch (err) {
      console.error("Помилка:", {
        error: err,
        response: err.response?.data
      });

      setError(
        err.response?.data?.title ||
        err.response?.data?.message ||
        err.message ||
        "Сталася помилка при бронюванні"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h2>Підтвердження бронювання</h2>
        <h3>{bookingInfo.court || bookingInfo.title}</h3>
        <p>Локація: {bookingInfo.location?.address || bookingInfo.location}</p>
        <p>Вид спорту: {getCorrectType(court.type).name}</p>
        <p>Дата: {bookingInfo.date}</p>
        <p>Час: {bookingInfo.time} - {bookingInfo.endTime}</p>
        <p>Тривалість: {bookingInfo.duration} год</p>

        <form onSubmit={handleSubmit}>
          {!isLoggedIn && (
            <>
              <label>Ім'я та прізвище</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Наприклад, Іван Петров"
                required
              />

              <label>Телефон</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.startsWith("+380") && value.length <= 13) {
                    setPhone(value);
                  }
                }}
                placeholder="+380 (XX) XXX-XX-XX"
                required
              />
            </>
          )}

          <label>Коментар (необов’язково)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ height: '64px' }}
            placeholder="Наприклад, бажано критий корт"
          />

          <p>Вартість: {bookingInfo.totalPrice} грн</p>
          <p className="notice">Клуб може змінити вартість послуги</p>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-buttons">
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || !isTimeValid}
            >
              {isSubmitting ? "Обробка..." : "Підтвердити бронювання"}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}