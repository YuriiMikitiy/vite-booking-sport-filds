import React, { useEffect, useRef, useState } from "react";
import "./BookingModalconfirmation.css";
import axios from "axios";
import { sports } from "../HomaPage/InputSection/dateTime";

function getCorrectType(type) {
  return sports[type] ?? { name: "Невідомий вид", icon: "" };
}

export default function BookingModalChooseServices({ court, onClose, onConfirm }) {
  const modalRef = useRef();

  const [date, setDate] = useState("");
  const [selectedSportType, setSelectedSportType] = useState(null);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [instances, setInstances] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState("");

  // Логування даних майданчика при завантаженні
  useEffect(() => {
    console.log("[DEBUG] Дані майданчика (court):", court);
    console.log("[DEBUG] Типи спорту в court.types:", court?.types);
  }, [court]);

  // Завантаження інстансів — БЕЗ запиту на бекенд, беремо з court.types
  useEffect(() => {
    if (selectedSportType?.type !== undefined) {
      const foundType = court?.types?.find(t => t.type === selectedSportType.type);
      console.log("[DEBUG] Обраний тип спорту з court.types:", foundType);

      const loadedInstances = foundType?.instances || [];
      setInstances(loadedInstances);

      if (loadedInstances.length === 1) {
        console.log("[DEBUG] Автоматичний вибір єдиного інстансу");
        setSelectedInstance(loadedInstances[0]);
      } else {
        console.log(`[DEBUG] Знайдено ${loadedInstances.length} інстансів`);
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
    console.log("[DEBUG] Не вистачає дати або типу → скидаємо слоти");
    setAvailableSlots([]);
    return;
  }

  console.log(`[DEBUG] Завантажуємо слоти: дата=${date}, тип=${selectedSportType.type}, інстанс=${selectedInstance?.id || "немає"}`);

  setSlotsLoading(true);
  setError("");

  let url = `https://localhost:44313/api/Booking/available-slots/${court.id}/${date}/${selectedSportType.type}`;
  if (selectedInstance?.id) {
    url += `/${selectedInstance.id}`;
  }

  try {
    const response = await axios.get(url);
    console.log("[DEBUG] Слоти з сервера:", response.data);

    const now = new Date();
    const future = response.data.filter(slot => new Date(slot.startTime) > now);
    setAvailableSlots(future);
    console.log(`[DEBUG] Залишилося майбутніх слотів: ${future.length}`);
  } catch (err) {
    console.error("[ERROR] Помилка слотів:", err.response?.data || err.message);
    if (err.response?.status === 404) {
      setError("Немає вільних слотів для цього типу/місця");
    } else {
      setError("Не вдалося завантажити вільні години");
    }
  } finally {
    setSlotsLoading(false);
  }
};

  useEffect(() => {
    fetchAvailableSlots();
  }, [date, selectedSportType?.type, selectedInstance?.id]);

  const availableBlocks = React.useMemo(() => {
  if (!availableSlots.length) return [];

  const blocks = [];
  const sorted = [...availableSlots].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  for (let i = 0; i < sorted.length; i++) {
    const slot = sorted[i];
    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);

    // Перевіряємо, чи це повна година
    if (end.getTime() - start.getTime() === 60 * 60 * 1000) {
      const startStr = start.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
      const endStr = end.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });

      blocks.push({
        start: startStr,
        end: endStr,
        startFull: slot.startTime,
        label: `${startStr} — ${endStr}`,
      });
    }
  }

  console.log("[DEBUG] Згенеровано годинних блоків:", blocks.length);
  return blocks;
}, [availableSlots]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!date) return setError("Оберіть дату");
    if (!selectedSportType) return setError("Оберіть вид спорту");
    if (!selectedBlock) return setError("Оберіть час");

    const requiresInstance = instances.length > 1;
    if (requiresInstance && !selectedInstance) {
      return setError("Оберіть номер місця/корту");
    }

    console.log("[DEBUG] Відправляємо бронювання:", {
      sportsFieldId: court.id,
      sportsFieldInstanceId: selectedInstance?.id || null,
      startTime: selectedBlock.startFull,
      durationMinutes: 60,
      sportType: selectedSportType.type,
    });

    try {
      const requestData = {
  sportsFieldId: court.id,
  startTime: selectedBlock.startFull,
  durationMinutes: 60,
  sportType: selectedSportType.type,
  sportsFieldInstanceId: selectedInstance?.id || null  // ← тепер передаємо instanceId
};

      const res = await axios.post(
        "https://localhost:44313/api/Booking/check-availability",
        requestData
      );

      console.log("[DEBUG] Перевірка доступності:", res.data);

      if (res.data === true) {
        onConfirm({
          court: court.title || court.name,
          location: court.location?.address || "",
          sportType: selectedSportType.type,
          instance: selectedInstance?.displayName || (instances.length === 0 ? "— (без номерів)" : "Автоматично"),
          instanceId: selectedInstance?.id || null,  // ← ДОДАЙ ЦЕ ПОЛЕ!
          date,
          time: selectedBlock.start,
          duration: 1,
          totalPrice: selectedSportType.pricePerHour,
          endTime: selectedBlock.end,
        });
        onClose();
      } else {
        setError("Цей час уже зайнятий");
      }
    } catch (err) {
      console.error("[ERROR] Помилка бронювання:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Помилка перевірки доступності");
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
        <h2>Бронювання: {court.title || court.name}</h2>

        <form onSubmit={handleSubmit}>
          {/* Вид спорту */}
          <label>Вид спорту</label>
          <select
            className="date-select"
            value={selectedSportType?.type ?? ""}
            onChange={(e) => {
              const val = Number(e.target.value);
              const found = court.types?.find(t => t.type === val);
              console.log("[DEBUG] Обрано тип спорту:", found);
              setSelectedSportType(found);
              setSelectedInstance(null);
              setSelectedBlock(null);
            }}
            required
          >
            <option value="" disabled>Оберіть вид спорту</option>
            {court.types?.map((t, i) => (
              <option key={i} value={t.type}>
                {getCorrectType(t.type).name} ({t.instances?.length || t.quantity || 1} шт)
              </option>
            ))}
          </select>

          {/* Блок інстансів */}
          {selectedSportType ? (
            instances.length > 1 ? (
              <>
                <label>Номер корту / столу / місця</label>
                <select
                  className="date-select"
                  value={selectedInstance?.id ?? ""}
                  onChange={(e) => {
                    const found = instances.find(inst => inst.id === e.target.value);
                    console.log("[DEBUG] Обрано інстанс:", found);
                    setSelectedInstance(found);
                    setSelectedBlock(null);
                  }}
                  required
                >
                  <option value="" disabled>Оберіть номер</option>
                  {instances.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.displayName || `Місце ${inst.id.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
              </>
            ) : instances.length === 1 && selectedInstance ? (
              <p style={{ margin: "12px 0", color: "#2c7be5", fontWeight: 500 }}>
                Автоматично обрано: <strong>{selectedInstance.displayName}</strong>
              </p>
            ) : (
              <p style={{ margin: "12px 0", color: "#555", fontStyle: "italic" }}>
                Місць/номерів не вказано (бронюємо весь майданчик)
              </p>
            )
          ) : null}

          {/* Дата */}
          <label>Дата</label>
          <select className="date-select" value={date} onChange={(e) => { setDate(e.target.value); setSelectedBlock(null); }} required>
            <option value="" disabled>Оберіть дату</option>
            {getNext7Days().map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>

          {/* Час */}
          <label>Час (1 година)</label>
          <select
            className="time-input"
            value={selectedBlock?.start || ""}
            onChange={(e) => setSelectedBlock(availableBlocks.find(b => b.start === e.target.value))}
            required
            disabled={slotsLoading || !date || !selectedSportType}
          >
            <option value="">
              {slotsLoading ? "Завантаження годин..." : "Оберіть час"}
            </option>
            {availableBlocks.map((b, i) => (
              <option key={i} value={b.start}>{b.label}</option>
            ))}
          </select>

          {error && <p className="error-message" style={{ color: 'red', marginTop: '12px' }}>{error}</p>}

          <div className="modal-buttons">
            <button
              type="submit"
              className="submit-button"
              disabled={slotsLoading || !selectedBlock || (instances.length > 1 && !selectedInstance)}
            >
              Підтвердити бронювання
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