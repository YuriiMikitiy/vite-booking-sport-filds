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

  // Перевіряємо, чи користувач залогінений при завантаженні компонента
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const id = localStorage.getItem('userId');
    setIsLoggedIn(loggedIn);
    setUserId(id);
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!isLoggedIn) {
        // Валідація для гостей
        if (!phone.startsWith("+380") || phone.length !== 13) {
          throw new Error("Телефон повинен починатися з +380 і мати 12 цифр");
        }
        if (!name.trim()) {
          throw new Error("Будь ласка, введіть ваше ім'я");
        }
      }

      const startTime = new Date(`${bookingInfo.date}T${bookingInfo.time}:00`);
      if (isNaN(startTime.getTime())) {
        throw new Error("Некоректна дата або час");
      }

      // Формуємо об'єкт бронювання в залежності від того, чи залогінений користувач
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
      // Тут можна додати сповіщення про успіх
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
        <p>Час: {bookingInfo.time}</p>
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

          <label>Коментар (необов'язково)</label>
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
              disabled={isSubmitting}
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

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setIsSubmitting(true);
//   setError(null);

//   try {
//     if (!phone.startsWith("+380") || phone.length !== 13) {
//       throw new Error("Телефон повинен починатися з +380 і мати 12 цифр");
//     }

//     const startTime = new Date(`${bookingInfo.date}T${bookingInfo.time}:00`);
//     if (isNaN(startTime.getTime())) {
//       throw new Error("Некоректна дата або час");
//     }

//     const bookingData = {
//       sportFieldId: court.id,
//       comment: comment || null,
//       startTime: startTime.toISOString(),
//       durationMinutes: bookingInfo.duration * 60,
//       totalPrice: bookingInfo.totalPrice,
//       fullName: name.trim(),
//       phoneNumber: phone
//     };

//     await axios.post(
//       "https://localhost:44313/api/Booking/bookings/guest",
//       bookingData,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json"
//         }
//       }
//     );

//     onClose();
//     // Тут можна додати сповіщення про успіх
//   } catch (err) {
//     console.error("Помилка:", {
//       error: err,
//       response: err.response?.data
//     });
    
//     setError(
//       err.response?.data?.title ||
//       err.response?.data?.message || 
//       err.message || 
//       "Сталася помилка при бронюванні"
//     );
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content" ref={modalRef}>
//         <h2>Підтвердження бронювання</h2>
//         <h3>{bookingInfo.court || bookingInfo.title}</h3>
//         <p>Локація: {bookingInfo.location?.address || bookingInfo.location}</p>
//         <p>Вид спорту: {getCorrectType(court.type).name}</p>
//         <p>Дата: {bookingInfo.date}</p>
//         <p>Час: {bookingInfo.time}</p>
//         <p>Тривалість: {bookingInfo.duration} год</p>

//         <form onSubmit={handleSubmit}>
//           <label>Ім'я та прізвище</label>
//           <input 
//             type="text" 
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Наприклад, Іван Петров" 
//             required 
//           />

//           <label>Телефон</label>
//           <input
//             type="tel"
//             value={phone}
//             onChange={(e) => {
//               const value = e.target.value;
//               if (value.startsWith("+380") && value.length <= 13) {
//                 setPhone(value);
//               }
//             }}
//             placeholder="+380 (XX) XXX-XX-XX"
//             required
//           />

//           <label>Коментар (необов'язково)</label>
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
//               disabled={isSubmitting}
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


