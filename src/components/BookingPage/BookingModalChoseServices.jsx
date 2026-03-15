import React, { useEffect, useRef, useState } from "react";
import "./BookingModalconfirmation.css";
import axios from "axios";
import { sports } from "../HomaPage/InputSection/dateTime";

function getCorrectType(type) {
  return sports[type] ?? { name: "Unknown", icon: "" };
}

export default function BookingModalChooseServices({ court, onClose, onConfirm }) {
  const modalRef = useRef();
  const [date, setDate] = useState("");
  const [selectedSportType, setSelectedSportType] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAvailableSlots = async () => {
    if (!date || selectedSportType?.type === undefined) {
      setAvailableSlots([]);
      return;
    }
    setLoading(true);
    setError("");
    const url = `https://localhost:44313/api/Booking/available-slots/${court.id}/${date}/${selectedSportType.type}`;
    
    try {
      const response = await axios.get(url);
      const now = new Date();
      // Фільтруємо тільки майбутні слоти
      const future = response.data.filter(slot => new Date(slot.startTime) > now);
      setAvailableSlots(future);
      console.log("[FETCH] Отримано слотів:", future.length);
    } catch (err) {
      console.error("[FETCH] Помилка:", err);
      setError("Не вдалося завантажити доступні години");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, [date, selectedSportType?.type, court?.id]);

  // ГЕНЕРАЦІЯ БЛОКІВ (Виправлено)
  const availableBlocks = React.useMemo(() => {
    if (!availableSlots.length) return [];
    
    const blocks = [];
    // Сортуємо за часом
    const sorted = [...availableSlots].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    for (let i = 0; i < sorted.length - 1; i++) {
      const first = sorted[i];
      const second = sorted[i + 1];

      const d1 = new Date(first.startTime);
      const d2 = new Date(second.startTime);

      // Різниця в часі між початком першого і другого слоту має бути рівно 30 хв (1800000 мс)
      const diffMs = d2.getTime() - d1.getTime();
      
      // Дозволяємо похибку в 10 секунд (якщо сервер повертає 09:30:01)
      if (diffMs >= 1740000 && diffMs <= 1860000) {
        const blockStart = d1.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
        
        // Кінець блоку — це початок другого слоту + 30 хв
        const endFull = new Date(d2.getTime() + 30 * 60000);
        const blockEnd = endFull.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });

        blocks.push({
          start: blockStart,
          end: blockEnd,
          startFull: first.startTime, // Зберігаємо ISO строку для відправки на бекенд
          label: `${blockStart} — ${blockEnd}`,
        });
        
        // Якщо хочеш, щоб слоти не перетиналися (напр. тільки 9:00-10:00 і 10:00-11:00), 
        // залиш i++. Якщо хочеш "ковзаюче" вікно (9:00-10:00, 9:30-10:30) — видали i++.
        i++; 
      }
    }
    return blocks;
  }, [availableSlots]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!date || !selectedSportType || !selectedBlock) {
      setError("Оберіть дату, вид спорту та блок часу");
      return;
    }

    try {
      // Використовуємо саме ту ISO строку, яку дав бекенд (selectedBlock.startFull)
      const requestData = {
        sportsFieldId: court.id,
        startTime: selectedBlock.startFull,
        durationMinutes: 60,
        sportType: selectedSportType.type,
      };

      console.log("[CHECK] Відправка перевірки:", requestData);

      const response = await axios.post(
        "https://localhost:44313/api/Booking/check-availability",
        requestData
      );

      if (response.data === true) {
        onConfirm({
          court: court.title,
          location: court.location.address,
          sportType: selectedSportType.type,
          date,
          time: selectedBlock.start,
          duration: 1,
          totalPrice: selectedSportType.pricePerHour,
          endTime: selectedBlock.end,
        });
      } else {
        setError("Цей час уже зайнятий (відповідь сервера: false)");
      }
    } catch (err) {
      console.error("[CHECK] Помилка запиту:", err);
      setError(err.response?.data?.message || "Помилка при перевірці доступності");
    }
  };

  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        label: d.toLocaleDateString("uk-UA", { weekday: "long", day: "numeric", month: "long" }),
        value: d.toISOString().split("T")[0]
      });
    }
    return days;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h2>Бронювання: {court.title}</h2>
        <form onSubmit={handleSubmit}>
          <label>Вид спорту</label>
          <select
            className="date-select"
            value={selectedSportType?.type ?? ""}
            onChange={(e) => {
              const val = Number(e.target.value);
              setSelectedSportType(court.types.find(t => t.type === val));
            }}
            required
          >
            <option value="" disabled>Оберіть вид спорту</option>
            {court.types?.map((t, i) => (
              <option key={i} value={t.type}>{getCorrectType(t.type).name}</option>
            ))}
          </select>

          <label>Дата</label>
          <select className="date-select" value={date} onChange={(e) => setDate(e.target.value)} required>
            <option value="" disabled>Оберіть дату</option>
            {getNext7Days().map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>

          <label>Час (1 година)</label>
          <select
            className="time-input"
            value={selectedBlock?.start || ""}
            onChange={(e) => setSelectedBlock(availableBlocks.find(b => b.start === e.target.value))}
            required
            disabled={loading || !date || !selectedSportType}
          >
            <option value="">{loading ? "Завантаження..." : "Оберіть час"}</option>
            {availableBlocks.map((b, i) => (
              <option key={i} value={b.start}>{b.label}</option>
            ))}
          </select>

          {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
          
          <div className="modal-buttons">
            <button type="submit" className="submit-button" disabled={loading || !selectedBlock}>
              Підтвердити
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>Скасувати</button>
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

// export default function BookingModalChooseServices({ court, onClose, onConfirm }) {
//   const modalRef = useRef();
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [duration, setDuration] = useState(1);
//   const [selectedSportType, setSelectedSportType] = useState(null);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Нормалізація часу HH:MM
//   function normalizeTime(timeStr) {
//     if (!timeStr) return "";
//     return timeStr.substring(0, 5);
//   }

//   // Генерація 30-хвилинних слотів з розкладу
//   function generateTimeOptions(start, end) {
//     if (!start || !end) return [];
//     const startNormalized = normalizeTime(start);
//     const endNormalized = normalizeTime(end);
//     const options = [];
//     const [startH, startM] = startNormalized.split(":").map(Number);
//     const [endH, endM] = endNormalized.split(":").map(Number);

//     let current = new Date();
//     current.setHours(startH, startM, 0, 0);
//     const endObj = new Date();
//     endObj.setHours(endH, endM, 0, 0);

//     while (current <= endObj) {
//       options.push(current.toTimeString().slice(0, 5));
//       current = new Date(current.getTime() + 30 * 60 * 1000);
//     }
//     return options;
//   }

//   // Перевірка, чи є вибраний час серед доступних слотів з бекенду
//   function isTimeSlotAvailable(timeStr) {
//   if (!availableSlots.length || !date) return false;

//   const selected = new Date(`${date}T${timeStr}:00`);
//   const selectedTime = selected.getHours() * 60 + selected.getMinutes();

//   return availableSlots.some((slot) => {
//     const slotStart = new Date(slot.startTime);
//     const slotTime = slotStart.getHours() * 60 + slotStart.getMinutes();
//     // Дозволяємо різницю до 1 хвилини (на випадок rounding)
//     return Math.abs(slotTime - selectedTime) <= 1;
//   });
// }

//   // Закриття при кліку поза модалкою
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose();
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [onClose]);

//   // Скидання часу при зміні дати або типу спорту
//   useEffect(() => {
//     setTime("");
//   }, [date, selectedSportType]);

//   // Функція завантаження слотів (можна викликати з кількох місць)
//   const fetchAvailableSlots = async () => {
//     if (!date || selectedSportType?.type === undefined) {
//       console.log("[FETCH] Пропускаємо — дата або тип спорту не готові");
//       setAvailableSlots([]);
//       return;
//     }

//     setLoading(true);
//     setError("");

//     const url = `https://localhost:44313/api/Booking/available-slots/${court.id}/${date}/${selectedSportType.type}`;
//     console.log("[FETCH SLOTS] Запит:", url);

//     try {
//       const response = await axios.get(url);
//       console.log("[FETCH SLOTS] Отримані дані:", response.data);

//       const now = new Date();
//       const futureSlots = response.data.filter((slot) => {
//         const start = new Date(slot.startTime);
//         return start > now;
//       });

//       console.log("[FETCH SLOTS] Майбутніх слотів:", futureSlots.length);
//       setAvailableSlots(futureSlots);
//     } catch (err) {
//       console.error("[FETCH SLOTS] Помилка:", err.message, err.response?.data);
//       setError("Не вдалося завантажити доступні години");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Автоматичний запуск при зміні дати або типу спорту
//   useEffect(() => {
//     fetchAvailableSlots();
//   }, [date, selectedSportType?.type, court?.id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!date || !time || !duration || !selectedSportType) {
//       setError("Будь ласка, заповніть всі поля");
//       return;
//     }

//     if (!isTimeSlotAvailable(time)) {
//       setError("Обраний час вже зайнятий або недоступний");
//       return;
//     }

//     const startTime = new Date(`${date}T${time}:00`);
//     if (isNaN(startTime.getTime())) {
//       setError("Некоректна дата або час");
//       return;
//     }

//     const endTimeDate = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

//     const scheduleForDay = selectedSportType.weeklySchedules?.find(
//       (ws) => ws.dayOfWeek === new Date(date).getDay()
//     );

//     if (!scheduleForDay) {
//       setError("Розклад для обраного дня недоступний");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "https://localhost:44313/api/Booking/check-availability",
//         {
//           sportsFieldId: court.id,
//           startTime: startTime.toISOString(),
//           durationMinutes: duration * 60,
//           sportType: selectedSportType.type,
//         }
//       );

//       if (response.data === true) {
//         const totalPrice = duration * selectedSportType.pricePerHour;
//         onConfirm({
//           court: court.title,
//           location: court.location.address,
//           sportType: selectedSportType.type,
//           date,
//           time,
//           duration,
//           totalPrice,
//           endTime: endTimeDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//         });
//       } else {
//         setError("Обраний час уже зайнятий");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Помилка при перевірці доступності");
//     }
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

//   const dayOfWeek = date ? new Date(date).getDay() : null;
//   const scheduleForDay = selectedSportType?.weeklySchedules?.find(
//     (ws) => ws.dayOfWeek === dayOfWeek
//   );

//   const allPossibleTimes = generateTimeOptions(
//     scheduleForDay?.availableFrom,
//     scheduleForDay?.availableTo
//   );

//   const availableTimes = allPossibleTimes.filter(isTimeSlotAvailable);

//   console.log("[RENDER] Стан часу:", {
//     loading,
//     availableTimesLength: availableTimes.length,
//     availableSlotsCount: availableSlots.length,
//     dateSelected: !!date,
//     sportType: selectedSportType?.type,
//   });

//   const startTimeObj = time ? new Date(`${date}T${time}:00`) : null;
//   const endTime = startTimeObj
//     ? new Date(startTimeObj.getTime() + duration * 60 * 60 * 1000).toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       })
//     : "";

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content" ref={modalRef}>
//         <h2>Бронювання корту</h2>
//         <h2>{court.title}</h2>
//         <p>Локація: {court.location.address}</p>

//         <form onSubmit={handleSubmit}>
//           <label>Вид спорту</label>
//           <select
//             className="date-select"
//             value={selectedSportType?.type != null ? String(selectedSportType.type) : ""}
//             onChange={(e) => {
//               const raw = e.target.value;
//               if (!raw) {
//                 setSelectedSportType(null);
//                 setTime("");
//                 return;
//               }
//               const num = Number(raw);
//               const found = court.types.find((t) => t.type === num);
//               if (found) {
//                 setSelectedSportType(found);
//               } else {
//                 setSelectedSportType(null);
//               }
//               setTime("");
//             }}
//             required
//           >
//             <option value="" disabled>
//               Оберіть вид спорту
//             </option>
//             {court.types?.map((typeObj, i) => (
//               <option key={i} value={String(typeObj.type)}>
//                 {getCorrectType(typeObj.type)?.name || `Тип ${typeObj.type}`}
//               </option>
//             ))}
//           </select>

//           <label>Дата</label>
//           <select
//             className="date-select"
//             value={date}
//             onChange={(e) => {
//               const newDate = e.target.value;
//               setDate(newDate);
//               setTime("");
//               if (selectedSportType?.type !== undefined) {
//                 fetchAvailableSlots();
//               }
//             }}
//             required
//           >
//             <option value="" disabled>
//               Оберіть дату
//             </option>
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
//             disabled={!date || !selectedSportType || loading}
//           >
//             <option value="" disabled>
//               {loading ? "Завантаження..." : "Оберіть час"}
//             </option>

//             {!loading && availableTimes.length > 0 ? (
//               availableTimes.map((t) => (
//                 <option key={t} value={t}>
//                   {t}
//                 </option>
//               ))
//             ) : (
//               !loading && date && selectedSportType && (
//                 <option disabled>Немає доступного часу</option>
//               )
//             )}
//           </select>

//           {loading && <p className="loading-message">Завантаження доступних годин...</p>}
//           {error && <p className="error-message">{error}</p>}

//           <label>Тривалість (годин)</label>
//           <select
//             className="duration-select"
//             value={duration}
//             onChange={(e) => setDuration(Number(e.target.value))}
//           >
//             {[1, 2, 3].map((hr) => (
//               <option key={hr} value={hr}>
//                 {hr} год
//               </option>
//             ))}
//           </select>

//           {time && (
//             <p>
//               Час бронювання: {time} – {endTime}
//             </p>
//           )}

//           <p>Ціна за годину: {selectedSportType?.pricePerHour || 0} грн</p>
//           <p>
//             Загальна вартість: <strong>{duration * (selectedSportType?.pricePerHour || 0)} грн</strong>
//           </p>
//           <p><em>Клуб може змінити вартість послуги</em></p>

//           <div className="modal-buttons">
//             <button type="submit" className="submit-button" disabled={loading || !time}>
//               Підтвердити та ввести контактні дані
//             </button>
//             <button type="button" className="cancel-button" onClick={onClose}>
//               Скасувати
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }