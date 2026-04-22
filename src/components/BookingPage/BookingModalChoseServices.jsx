import React, { useEffect, useRef, useState, useContext } from "react";
import { LanguageContext } from "../../assets/LanguageContext"; // Переконайся, що шлях правильний
import "./BookingModalconfirmation.css";
import axios from "axios";
import { useModalBodyLock } from "../../hooks/useModalBodyLock.js";
import { API_BASE } from "../../config/api.js";

/** Локальний календарний YYYY-MM-DD (toISOString() дає UTC і ламає день біля півночі) */
function formatLocalYmd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** API повертає ISO із Z; для користувача показуємо той самий "wall clock" час як у слоті */
function formatSlotTime(iso, language) {
  return new Date(iso).toLocaleTimeString(
    language === "uk" ? "uk-UA" : language === "pl" ? "pl-PL" : "en-GB",
    { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }
  );
}

export default function BookingModalChooseServices({ court, onClose, onConfirm }) {
  const { language, translations } = useContext(LanguageContext);
  const t = translations[language];
  const modalRef = useRef();
  useModalBodyLock(true);

  const [date, setDate] = useState("");
  const [selectedSportType, setSelectedSportType] = useState(null);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [instances, setInstances] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState("");

  // Функція для отримання перекладеної назви спорту
  function getTranslatedSportName(type) {
    const sportKeys = [
      'tennis',       // 0
      'badminton',    // 1
      'footballField',// 2
      'box',          // 3
      'pingPong',     // 4
      'biliard',      // 5
      'basketball'    // 6
    ];
    const key = sportKeys[type] || 'all';
    return t.sports[key];
  }

  // Завантаження інстансів
  useEffect(() => {
    if (selectedSportType?.type !== undefined) {
      const foundType = court?.types?.find(t => t.type === selectedSportType.type);
      const loadedInstances = foundType?.instances || [];
      setInstances(loadedInstances);

      if (loadedInstances.length === 1) {
        setSelectedInstance(loadedInstances[0]);
      } else {
        setSelectedInstance(null);
      }
    } else {
      setInstances([]);
      setSelectedInstance(null);
    }
  }, [selectedSportType, court]);

  // Завантаження слотів
  const fetchAvailableSlots = async () => {
    if (!date || selectedSportType?.type === undefined) {
      setAvailableSlots([]);
      return;
    }

    setSlotsLoading(true);
    setError("");

    let url = `${API_BASE}/Booking/available-slots/${court.id}/${date}/${selectedSportType.type}`;
    if (selectedInstance?.id) {
      url += `/${selectedInstance.id}`;
    }

    try {
      console.groupCollapsed("[Booking] available-slots request");
      console.log("courtId:", court.id);
      console.log("date:", date);
      console.log("sportType:", selectedSportType.type);
      console.log("instanceId:", selectedInstance?.id ?? null);
      console.log("url:", url);
      const response = await axios.get(url);
      const rows = Array.isArray(response.data) ? response.data : [];
      const todayLocal = formatLocalYmd(new Date());
      const isBookingToday = date === todayLocal;
      /* Минуле відсікаємо лише для «сьогодні»; для майбутніх днів показуємо всі слоти з API */
      const list = isBookingToday
        ? rows.filter((slot) => new Date(slot.startTime) > new Date())
        : rows;
      console.log("response status:", response.status);
      console.log("slots from API:", rows);
      console.log("slots after client filter:", list);
      console.groupEnd();
      setAvailableSlots(list);
    } catch (err) {
      console.groupCollapsed("[Booking] available-slots error");
      console.log("url:", url);
      console.log("status:", err.response?.status);
      console.log("response:", err.response?.data);
      console.error(err);
      console.groupEnd();
      if (err.response?.status === 404) {
        setError(t.bookingModal.noSlots);
      } else {
        setError(t.common.error);
      }
    } finally {
      setSlotsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, [date, selectedSportType?.type, selectedInstance?.id]);

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

  const availableBlocks = React.useMemo(() => {
    if (!availableSlots.length) return [];

    const blocks = [];
    const sorted = [...availableSlots].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    for (let i = 0; i < sorted.length; i++) {
      const slot = sorted[i];
      const start = new Date(slot.startTime);
      const end = new Date(slot.endTime);

      if (end.getTime() - start.getTime() === 60 * 60 * 1000) {
        const startStr = formatSlotTime(slot.startTime, language);
        const endStr = formatSlotTime(slot.endTime, language);

        blocks.push({
          start: startStr,
          end: endStr,
          startFull: slot.startTime,
          label: `${startStr} — ${endStr}`,
        });
      }
    }
    return blocks;
  }, [availableSlots, language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!date) return setError(t.bookingModal.selectDateError);
    if (!selectedSportType) return setError(t.bookingModal.selectSportError);
    if (!selectedBlock) return setError(t.bookingModal.selectTimeError);

    if (instances.length > 1 && !selectedInstance) {
      return setError(t.bookingModal.selectInstanceError); 
    }

    try {
      const requestData = {
        sportsFieldId: court.id,
        startTime: selectedBlock.startFull,
        durationMinutes: 60,
        sportType: selectedSportType.type,
        sportsFieldInstanceId: selectedInstance?.id || null
      };

      const res = await axios.post(
        `${API_BASE}/Booking/check-availability`,
        requestData
      );

      if (res.data === true) {
        onConfirm({
          court: court.title || court.name,
          location: court.location?.address || "",
          sportType: selectedSportType.type,
          instance: selectedInstance?.displayName || (instances.length === 0 ? "—" : "Автоматично"),
          instanceId: selectedInstance?.id || null,
          date,
          time: selectedBlock.start,
          /** Точний час з API (UTC); не збирати з date + time — інакше зламається часовий пояс */
          startTimeUtc: selectedBlock.startFull,
          duration: 1,
          totalPrice: selectedSportType.pricePerHour,
          endTime: selectedBlock.end,
        });
        onClose();
      } else {
        setError(t.bookingModal.timeTaken);
      }
    } catch (err) {
      setError(err.response?.data?.message || t.common.error);
    }
  };

  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        label: d.toLocaleDateString(language === 'uk' ? "uk-UA" : (language === 'pl' ? "pl-PL" : "en-GB"), { weekday: "long", day: "numeric", month: "long" }),
        value: formatLocalYmd(d),
      });
    }
    return days;
  };

  return (
    <div className="app-modal-overlay">
      <div className="app-modal-panel" ref={modalRef}>
        <h2 className="app-modal-title">{t.bookingModal.bookTitle}: {court.title || court.name}</h2>

        <form onSubmit={handleSubmit}>
          <label>{t.bookingModal.chooseSport}</label>
          <select
            className="date-select"
            value={selectedSportType?.type ?? ""}
            onChange={(e) => {
              const val = Number(e.target.value);
              const found = court.types?.find(t => t.type === val);
              setSelectedSportType(found);
              setSelectedInstance(null);
              setSelectedBlock(null);
            }}
            required
          >
            <option value="" disabled>{t.bookingModal.chooseSportPlaceholder}</option>
            {court.types?.map((t, i) => (
              <option key={i} value={t.type}>
                {getTranslatedSportName(t.type)} ({t.instances?.length || t.quantity || 1} шт)
              </option>
            ))}
          </select>

          {selectedSportType && (
            instances.length > 1 ? (
              <>
                <label>{t.bookingModal.chooseCourtNumber}</label>
                <select
                  className="date-select"
                  value={selectedInstance?.id ?? ""}
                  onChange={(e) => {
                    const found = instances.find(inst => inst.id === e.target.value);
                    setSelectedInstance(found);
                    setSelectedBlock(null);
                  }}
                  required
                >
                  <option value="" disabled>{t.bookingModal.chooseNumberPlaceholder}</option>
                  {instances.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.displayName || `ID: ${inst.id.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
              </>
            ) : instances.length === 1 && selectedInstance ? (
              <p className="app-modal-hint">
                {selectedInstance.displayName}
              </p>
            ) : null
          )}

          <label>{t.bookingModal.date}</label>
          <select className="date-select" value={date} onChange={(e) => { setDate(e.target.value); setSelectedBlock(null); }} required>
            <option value="" disabled>{t.bookingModal.chooseDatePlaceholder}</option>
            {getNext7Days().map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>

          <label>{t.bookingModal.timeLabel}</label>
          <select
            className="time-input"
            value={selectedBlock?.startFull || ""}
            onChange={(e) =>
              setSelectedBlock(availableBlocks.find((b) => b.startFull === e.target.value))
            }
            required
            disabled={slotsLoading || !date || !selectedSportType}
          >
            <option value="">
              {slotsLoading ? t.common.loading : t.bookingModal.chooseTimePlaceholder}
            </option>
            {availableBlocks.map((b, i) => (
              <option key={i} value={b.startFull}>
                {b.label}
              </option>
            ))}
          </select>

          {error && <p className="error-message">{error}</p>}

          <div className="app-modal-actions">
            <button
              type="submit"
              className="app-modal-btn app-modal-btn--primary"
              disabled={slotsLoading || !selectedBlock || (instances.length > 1 && !selectedInstance)}
            >
              {t.bookingModal.confirmBooking}
            </button>
            <button type="button" className="app-modal-btn app-modal-btn--danger" onClick={onClose}>{t.bookingModal.cancel}</button>
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