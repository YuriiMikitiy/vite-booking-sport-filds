// import React, { useEffect, useRef, useState } from "react";
// import "./BookingModalconfirmation.css";
// import axios from "axios";
// import { sports } from "../HomaPage/InputSection/dateTime";

// function getCorrectType(type) {
//   return sports[type] ?? { name: "Unknown", icon: "" };
// }

// export default function BookingModalconfirmation({ court, bookingInfo, onClose }) {
//   const modalRef = useRef();
//   const [phone, setPhone] = useState("+380");
//   const [name, setName] = useState("");
//   const [comment, setComment] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [bookedSlots, setBookedSlots] = useState([]);
//   const [isTimeValid, setIsTimeValid] = useState(true);

  

//   // Check if user is logged in
//   useEffect(() => {
//     const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
//     const id = localStorage.getItem('userId');
//     setIsLoggedIn(loggedIn);
//     setUserId(id);
//   }, []);

//   // Fetch booked time slots for the selected court and date
//   useEffect(() => {
//   async function fetchBookedSlots() {
//     try {
//       const response = await axios.get(
//         `https://localhost:44313/api/Booking/available-slots/${court.id}/${bookingInfo.date}/${bookingInfo.sportType}`  // <-- ДОДАЛИ /${bookingInfo.sportType}
//       );
//       setBookedSlots(response.data || []);
//     } catch (err) {
//       console.error("Error fetching booked slots:", err);
//       setError("Не вдалося завантажити інформацію про бронювання");
//     }
//   }
//   if (court.id && bookingInfo.date && bookingInfo.sportType !== undefined) {
//     fetchBookedSlots();
//   }
// }, [court.id, bookingInfo.date, bookingInfo.sportType]);

//   // Handle click outside to close modal
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose();
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [onClose]);

//   // Validate selected time
//   useEffect(() => {
//     const selectedDateTime = new Date(`${bookingInfo.date}T${bookingInfo.time}:00`);
//     const now = new Date();

//     // Check if selected time is in the past
//     if (selectedDateTime < now) {
//       setIsTimeValid(false);
//       setError("Ви не можете вибрати час у минулому");
//       return;
//     }

//     // Check if selected time slot is already booked
//     const isSlotBooked = bookedSlots.some(slot => {
//       const slotStart = new Date(slot.startTime);
//       const slotEnd = new Date(slotStart.getTime() + slot.durationMinutes * 60 * 1000);
//       const selectedEnd = new Date(selectedDateTime.getTime() + bookingInfo.duration * 60 * 60 * 1000);

//       return (
//         selectedDateTime < slotEnd &&
//         selectedEnd > slotStart
//       );
//     });

//     if (isSlotBooked) {
//       setIsTimeValid(false);
//       setError("Обраний час уже заброньовано");
//     } else {
//       setIsTimeValid(true);
//       if (error === "Обраний час уже заброньовано" || error === "Ви не можете вибрати час у минулому") {
//         setError(null);
//       }
//     }
//   }, [bookingInfo.date, bookingInfo.time, bookingInfo.duration, bookedSlots, error]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     try {
//       if (!isLoggedIn) {
//         // Guest validation
//         if (!phone.startsWith("+380") || phone.length !== 13) {
//           throw new Error("Телефон повинен починатися з +380 і мати 12 цифр");
//         }
//         if (!name.trim()) {
//           throw new Error("Будь ласка, введіть ваше ім'я");
//         }
//       }

//       // const startTime = new Date(`${bookingInfo.date}T${bookingInfo.time}:00`);
//       // if (isNaN(startTime.getTime())) {
//       //   throw new Error("Некоректна дата або час");
//       // }

//       const startTime = new Date(`${bookingInfo.date}T${bookingInfo.time}:00Z`);
//     if (isNaN(startTime.getTime())) {
//       throw new Error("Некоректна дата або час");
//     }

//       if (!isTimeValid) {
//         throw new Error("Обраний час недоступний");
//       }


//       // Create booking object based on login status
//       const bookingData = isLoggedIn
//   ? {
//       sportFieldId: court.id,
//       comment: comment || null,
//       sportType: Number(bookingInfo.sportType),
//       startTime: startTime.toISOString(),
//       durationMinutes: bookingInfo.duration * 60,
//       totalPrice: bookingInfo.totalPrice,
//       userId: userId,
//       sportsFieldInstanceId: bookingInfo.instanceId   // ← ДОДАЙ ЦЕ!
//     }
//   : {
//       sportFieldId: court.id,
//       comment: comment || null,
//       sportType: Number(bookingInfo.sportType),
//       startTime: startTime.toISOString(),
//       durationMinutes: bookingInfo.duration * 60,
//       totalPrice: bookingInfo.totalPrice,
//       fullName: name.trim(),
//       phoneNumber: phone,
//       sportsFieldInstanceId: bookingInfo.instanceId   // ← і тут теж!
//     };

//       const endpoint = isLoggedIn
//         ? "https://localhost:44313/api/Booking/bookings"
//         : "https://localhost:44313/api/Booking/bookings/guest";

//       await axios.post(endpoint, bookingData, {
//         headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json"
//         }
//       });

//       onClose();
//       // Add success notification here if needed
//     } catch (err) {
//       console.error("Помилка:", {
//         error: err,
//         response: err.response?.data
//       });

//       setError(
//         err.response?.data?.title ||
//         err.response?.data?.message ||
//         err.message ||
//         "Сталася помилка при бронюванні"
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content" ref={modalRef}>
//         <h2>Підтвердження бронювання</h2>
//         <h3>{bookingInfo.court || bookingInfo.title}</h3>
//         <p>Локація: {bookingInfo.location?.address || bookingInfo.location}</p>
//         <p>Вид спорту: {getCorrectType(bookingInfo.sportType)?.name || "Не обрано"}</p>
//         <p>Дата: {bookingInfo.date}</p>
//         <p>Час: {bookingInfo.time} - {bookingInfo.endTime}</p>
//         <p>Тривалість: {bookingInfo.duration} год</p>

//         <form onSubmit={handleSubmit}>
//           {!isLoggedIn && (
//             <>
//               <label>Ім'я та прізвище</label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Наприклад, Іван Петров"
//                 required
//               />

//               <label>Телефон</label>
//               <input
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   if (value.startsWith("+380") && value.length <= 13) {
//                     setPhone(value);
//                   }
//                 }}
//                 placeholder="+380 (XX) XXX-XX-XX"
//                 required
//               />
//             </>
//           )}

//           <label>Коментар (необов’язково)</label>
//           <textarea
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             style={{ height: '64px' }}
//             placeholder="Наприклад, бажано критий корт"
//           />

//           <p>Вартість: {bookingInfo.totalPrice} грн</p>
//           <p className="notice">Клуб може змінити вартість послуги</p>

//           {error && <p className="error-message">{error}</p>}

//           <div className="modal-buttons">
//             <button
//               type="submit"
//               className="submit-button"
//               disabled={isSubmitting || !isTimeValid}
//             >
//               {isSubmitting ? "Обробка..." : "Підтвердити бронювання"}
//             </button>
//             <button
//               type="button"
//               className="cancel-button"
//               onClick={onClose}
//               disabled={isSubmitting}
//             >
//               Скасувати
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useRef, useState, useContext } from "react";
import { LanguageContext } from "../../assets/LanguageContext";
import { useToast } from "../../context/ToastContext.jsx";
import "./BookingModalconfirmation.css";
import axios from "axios";
import { sports } from "../HomaPage/InputSection/dateTime";
import { useModalBodyLock } from "../../hooks/useModalBodyLock.js";
import { API_BASE } from "../../config/api.js";

export default function BookingModalconfirmation({ court, bookingInfo, onClose }) {
  const { language, translations } = useContext(LanguageContext);
  const t = translations[language];
  const { showToast } = useToast();

  const modalRef = useRef();
  useModalBodyLock(true);
  const [phone, setPhone] = useState("+380");
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isTimeValid, setIsTimeValid] = useState(true);

  function getCorrectType(type) {
    const sportKeys = ['tennis', 'badminton', 'footballField', 'box', 'pingPong', 'biliard', 'basketball'];
    const key = sportKeys[type] || 'all';
    return { name: t.sports[key] };
  }

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const id = localStorage.getItem('userId');
    setIsLoggedIn(loggedIn);
    setUserId(id);
  }, []);

  useEffect(() => {
    async function fetchBookedSlots() {
      try {
        const response = await axios.get(
          `${API_BASE}/Booking/available-slots/${court.id}/${bookingInfo.date}/${bookingInfo.sportType}`
        );
        setBookedSlots(response.data || []);
      } catch (err) {
        setError(t.common.error);
      }
    }
    if (court.id && bookingInfo.date && bookingInfo.sportType !== undefined) {
      fetchBookedSlots();
    }
  }, [court.id, bookingInfo.date, bookingInfo.sportType, t.common.error]);

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

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  try {
    // Валідація для гостя
    if (!isLoggedIn) {
      if (!phone.startsWith("+380") || phone.length !== 13) {
        throw new Error(t.bookingModal.guestPhoneError || "Телефон повинен починатися з +380 і мати 13 символів");
      }
      if (!name.trim()) {
        throw new Error(t.bookingModal.guestNameError || "Ім'я обов'язкове");
      }
    }

    const startTime = bookingInfo.startTimeUtc
      ? new Date(bookingInfo.startTimeUtc)
      : new Date(`${bookingInfo.date}T${bookingInfo.time}:00Z`);
    if (isNaN(startTime.getTime())) {
      throw new Error(t.common.error || "Некоректна дата або час");
    }
    const startTimeIso = startTime.toISOString();

    // Формуємо дані для відправки
    const bookingData = isLoggedIn
      ? {
          sportFieldId: court.id,
          comment: comment?.trim() || null,
          sportType: Number(bookingInfo.sportType),
          startTime: startTimeIso,
          durationMinutes: bookingInfo.duration * 60,
          totalPrice: bookingInfo.totalPrice,
          userId: userId,
          sportsFieldInstanceId: bookingInfo.instanceId || null
        }
      : {
          sportFieldId: court.id,
          comment: comment?.trim() || null,
          sportType: Number(bookingInfo.sportType),
          startTime: startTimeIso,
          durationMinutes: bookingInfo.duration * 60,
          totalPrice: bookingInfo.totalPrice,
          fullName: name.trim(),
          phoneNumber: phone,
          sportsFieldInstanceId: bookingInfo.instanceId || null
        };

      const endpoint = isLoggedIn
      ? `${API_BASE}/Booking/bookings`
      : `${API_BASE}/Booking/bookings/guest`;

    console.log("Відправляємо бронювання:", bookingData); // для діагностики

    await axios.post(endpoint, bookingData);

    const successMsg =
      t.bookingModal.success || "Бронювання успішно створено!";
    showToast(successMsg, "success");
    /* Спочатку показуємо тост по центру, потім закриваємо модалку — інакше оновлення дерева могло «з’їдати» повідомлення */
    window.setTimeout(() => {
      onClose();
    }, 500);

  } catch (err) {
    console.error("Помилка бронювання:", err.response?.data || err);

    const errorMessage = 
      err.response?.data?.message || 
      err.response?.data?.title || 
      err.message || 
      t.common.error || 
      "Сталася помилка при бронюванні";

    setError(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="app-modal-overlay">
      <div className="app-modal-panel" ref={modalRef}>
        <h2 className="app-modal-title">{t.bookingModal.confirmationTitle}</h2>
        <h3>{bookingInfo.court || bookingInfo.title}</h3>
        <p>{t.bookingModal.location} {bookingInfo.location?.address || bookingInfo.location}</p>
        <p>{t.bookingModal.sportType} {getCorrectType(bookingInfo.sportType)?.name}</p>
        <p>{t.bookingModal.date}: {bookingInfo.date}</p>
        <p>{t.bookingModal.timeLabel}: {bookingInfo.time} - {bookingInfo.endTime}</p>

        <form onSubmit={handleSubmit}>
          {!isLoggedIn && (
            <>
              <label>{t.bookingModal.fullName}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              <label>{t.bookingModal.phone}</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </>
          )}

          <label>{t.bookingModal.commentOptional}</label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />

          <p>{t.bookingModal.costLabel} {bookingInfo.totalPrice} грн</p>
          <p className="notice">{t.bookingModal.notice}</p>

          {error && <p className="error-message">{error}</p>}

          <div className="app-modal-actions">
            <button type="submit" className="app-modal-btn app-modal-btn--primary" disabled={isSubmitting}>
              {isSubmitting ? t.bookingModal.processing : t.bookingModal.submit}
            </button>
            <button type="button" className="app-modal-btn app-modal-btn--danger" onClick={onClose}>
              {t.bookingModal.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}