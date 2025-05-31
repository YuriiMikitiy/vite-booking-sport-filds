import React, { useEffect, useRef, useState } from "react";
import "./BookingModalconfirmation.css";
import axios from "axios";
import { sports } from "../HomaPage/InputSection/dateTime";

function getCorrectType(type) {
  return sports[type] ?? { name: "Unknown", icon: "" };
}

export default function BookingModalChooseServices({ court, onClose, sportType, onConfirm }) {
  const modalRef = useRef();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  // Fetch available slots when date changes
  useEffect(() => {
    if (!date) return;

    const fetchAvailableSlots = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://localhost:44313/api/Booking/available-slots/${court.id}/${date}`
        );
        // Фільтруємо слоти, щоб показувати лише майбутні
        const now = new Date();
        const filteredSlots = response.data.filter(slot => {
          const slotStartTime = new Date(slot.startTime);
          return slotStartTime > now;
        });
        setAvailableSlots(filteredSlots);
        setError("");
      } catch (err) {
        setError("Не вдалося завантажити доступні години");
        console.error("Помилка:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [date, court.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!date || !time || !duration) {
      setError("Будь ласка, заповніть всі поля");
      return;
    }

    try {
      // Створюємо startTime як UTC
      const startTime = new Date(`${date}T${time}:00Z`);
      if (isNaN(startTime.getTime())) {
        setError("Некоректна дата або час");
        return;
      }

      // Calculate end time for validation and display
      const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

      // Логування для дебагу
      console.log("Start Time (UTC):", startTime.toISOString());
      console.log("End Time (UTC):", endTime.toISOString());

      // Check availability with the backend
      const response = await axios.post(
        "https://localhost:44313/api/Booking/check-availability",
        {
          sportsFieldId: court.id,
          startTime: startTime.toISOString(),
          durationMinutes: duration * 60,
        }
      );

      if (response.data) {
        const totalPrice = duration * court.pricePerHour;
        onConfirm({
          court: court.title,
          location: court.location.address,
          sportType,
          date,
          time,
          duration,
          totalPrice,
          endTime: endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }),
        });
      } else {
        setError("Обраний час уже зайнятий. Спробуйте інший.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Помилка бронювання");
    }
  };

  const getNext7Days = () => {
    const days = [];
    const options = { weekday: "long", day: "numeric", month: "long" };

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const label = d.toLocaleDateString("uk-UA", options);
      const value = d.toISOString().split("T")[0];
      days.push({ label, value });
    }

    return days;
  };

  const formatTimeSlot = (slot) => {
    return new Date(slot.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Calculate end time for display
  const startTime = time ? new Date(`${date}T${time}:00Z`) : null;
  const endTime = startTime
    ? new Date(startTime.getTime() + duration * 60 * 60 * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      })
    : "";

  const totalPrice = duration * court.pricePerHour;

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h2>Бронювання корту</h2>
        <h2>{court.title}</h2>
        <p>Локація: {court.location.address}</p>

        <form onSubmit={handleSubmit}>
          <label>Вид спорту</label>
          <h2>{getCorrectType(court.type).name}</h2>

          <label>Дата</label>
          <select
            className="date-select"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setTime("");
            }}
            required
          >
            <option value="" disabled>
              Оберіть дату
            </option>
            {getNext7Days().map((d) => (
              <option key={d.value} value={d.value}>
                {d.label.charAt(0).toUpperCase() + d.label.slice(1)}
              </option>
            ))}
          </select>

          <label>Час початку</label>
          <select
            className="time-input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            disabled={!date || loading}
          >
            <option value="" disabled>
              Оберіть час
            </option>
            {availableSlots.map((slot) => (
              <option key={slot.startTime} value={formatTimeSlot(slot)}>
                {formatTimeSlot(slot)}
              </option>
            ))}
          </select>

          {loading && <p>Завантаження доступних годин...</p>}
          {error && <p className="error-message">{error}</p>}

          <label>Тривалість (годин)</label>
          <select
            className="duration-select"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
          >
            {[1, 2, 3].map((hr) => (
              <option key={hr} value={hr}>{hr} год</option>
            ))}
          </select>

          {time && <p>Час бронювання: {time} - {endTime}</p>}

          <p>Ціна за годину: {court.pricePerHour} грн</p>
          <p>
            Загальна вартість: <strong>{totalPrice} грн</strong>
          </p>
          <p>
            <em>Клуб може змінити вартість послуги</em>
          </p>

          <div className="modal-buttons">
            <button type="submit" className="submit-button" disabled={loading}>
              Підтвердити та ввести контактні дані
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}






//----------------------------------------------------------------------------------------------

// import React, { useEffect, useRef, useState } from "react";
// import "./BookingModalconfirmation.css";
// import {sports} from "../HomaPage/InputSection/dateTime";

// function getCorrectType(type) {
//   return sports[type] ?? { name: "Unknown", icon: "" };
// }

// export default function BookingModalChooseServices({ court, onClose, sportType, onConfirm }) {
//   const modalRef = useRef();

//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [duration, setDuration] = useState(1);

//   const today = new Date();
//   const minDate = today.toISOString().split("T")[0];

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

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const totalPrice = duration * court.pricePerHour;

//     const bookingDetails = {
//       court: court.title,
//       location: court.location.address,
//       sportType,
//       date,
//       time,
//       duration,
//       totalPrice,
//     };

//     onConfirm(bookingDetails);
//   };

//   const getAvailableTimeOptions = () => {
//     const options = [];
//     const now = new Date();

//     for (let h = 8; h <= 21; h++) {
//       ["00", "30"].forEach((min) => {
//         const timeStr = `${h.toString().padStart(2, "0")}:${min}`;

//         if (date === minDate) {
//           const timeDate = new Date();
//           timeDate.setHours(h);
//           timeDate.setMinutes(Number(min));
//           timeDate.setSeconds(0);
//           timeDate.setMilliseconds(0);

//           if (timeDate > now) {
//             options.push(timeStr);
//           }
//         } else {
//           options.push(timeStr);
//         }
//       });
//     }

//     return options;
//   };

//   const getNext7Days = () => {
//     const days = [];
//     const options = { weekday: "long", day: "numeric", month: "long" };
  
//     for (let i = 0; i < 7; i++) {
//       const d = new Date();
//       d.setDate(d.getDate() + i);
  
//       const label = d.toLocaleDateString("uk-UA", options);
//       const value = d.toISOString().split("T")[0];
  
//       days.push({ label, value });
//     }
  
//     return days;
//   };

//   const totalPrice = duration * court.pricePerHour;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content" ref={modalRef}>
//         <h2>Бронювання корту</h2>
//         <h2>{court.title}</h2>
//         <p>Локація: {court.location.address}</p>

//         <form onSubmit={handleSubmit}>
//           <label>Вид спорту</label>
//           <h2>{getCorrectType(court.type).name}</h2>

//           <label>Дата</label>
//           <select
//             className="date-select"
//             value={date}
//             onChange={(e) => {
//               setDate(e.target.value);
//               setTime("");
//             }}
//             required
//           >
//             <option value="" disabled>Оберіть дату</option>
//             {getNext7Days().map((d) => (
//               <option key={d.value} value={d.value}>
//                 {d.label.charAt(0).toUpperCase() + d.label.slice(1)}
//               </option>
//             ))}
//           </select>

//           <label>Час початку</label>
//           <select
//             className="time-input"
//             value={time}
//             onChange={(e) => setTime(e.target.value)}
//             required
//             disabled={!date}
//           >
//             <option value="" disabled>Оберіть час</option>
//             {getAvailableTimeOptions().map((t) => (
//               <option key={t} value={t}>{t}</option>
//             ))}
//           </select>

//           <label>Тривалість (годин)</label>
//           <select
//             className="duration-select"
//             value={duration}
//             onChange={(e) => setDuration(parseInt(e.target.value))}
//           >
//             {[1, 2, 3].map((hr) => (
//               <option key={hr} value={hr}>{hr} год</option>
//             ))}
//           </select>

//           <p>Ціна за годину: {court.pricePerHour} грн</p>
//           <p>Загальна вартість: <strong>{totalPrice} грн</strong></p>
//           <p><em>Клуб може змінити вартість послуги</em></p>

//           <div className="modal-buttons">
//             <button type="submit" className="submit-button">
//               Підтвердити та ввести контактні дані
//             </button>
            
//             <button
//               type="button"
//               className="cancel-button"
//               onClick={onClose}
//             >
//               Скасувати
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }