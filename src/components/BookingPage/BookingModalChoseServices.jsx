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
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [selectedSportType, setSelectedSportType] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("Received court:", court);

  // Підрізати час до "HH:MM"
   function normalizeTime(timeStr) {
    console.log("normalizeTime input:", timeStr);
    if (!timeStr) return "";
    const normalized = timeStr.substring(0, 5); // Відрізати секунди
    console.log("normalizeTime output:", normalized);
    return normalized;
  }

  // Функція для генерації масиву часу з кроком 30 хв від start до end
  function generateTimeOptions(start, end) {
    if (!start || !end) return [];

    const startNormalized = normalizeTime(start);
    const endNormalized = normalizeTime(end);

    const options = [];
    const [startH, startM] = startNormalized.split(":").map(Number);
    const [endH, endM] = endNormalized.split(":").map(Number);

    let current = new Date();
    current.setHours(startH, startM, 0, 0);

    const endTime = new Date();
    endTime.setHours(endH, endM, 0, 0);

    while (current <= endTime) {
      const timeStr = current.toTimeString().slice(0, 5); // "HH:MM"
      options.push(timeStr);
      current = new Date(current.getTime() + 30 * 60 * 1000); // 30 хв
    }

    return options;
  }

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

  // Скидаємо час при зміні дати або виду спорту
  useEffect(() => {
    setTime("");
  }, [date, selectedSportType]);

  // Фетч доступних слотів — можеш залишити чи видалити, якщо не потрібно
  useEffect(() => {
    if (!date) return;

    const fetchAvailableSlots = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://localhost:44313/api/Booking/available-slots/${court.id}/${date}`
        );
        const now = new Date();
        const filteredSlots = response.data.filter((slot) => {
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   if (!date || !time || !duration || !selectedSportType) {
  //     setError("Будь ласка, заповніть всі поля");
  //     return;
  //   }

  //   try {
  //     const startTime = new Date(`${date}T${time}:00Z`);
  //     if (isNaN(startTime.getTime())) {
  //       setError("Некоректна дата або час");
  //       return;
  //     }

  //     const endTimeDate = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

  //     const response = await axios.post(
  //       "https://localhost:44313/api/Booking/check-availability",
  //       {
  //         sportsFieldId: court.id,
  //         startTime: startTime.toISOString(),
  //         durationMinutes: duration * 60,
  //       }
  //     );

  //     if (response.data) {
  //       const totalPrice = duration * selectedSportType.pricePerHour;
  //       onConfirm({
  //         court: court.title,
  //         location: court.location.address,
  //         sportType: getCorrectType(selectedSportType.type)?.name,
  //         date,
  //         time,
  //         duration,
  //         totalPrice,
  //         endTime: endTimeDate.toLocaleTimeString([], {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //           timeZone: "UTC",
  //         }),
  //       });
  //     } else {
  //       setError("Обраний час уже зайнятий. Спробуйте інший.");
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Помилка бронювання");
  //   }
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!date || !time || !duration || !selectedSportType) {
    setError("Будь ласка, заповніть всі поля");
    return;
  }

  const startTime = new Date(`${date}T${time}:00Z`);
  if (isNaN(startTime.getTime())) {
    setError("Некоректна дата або час");
    return;
  }

  const endTimeDate = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

  // Перевірка по розкладу
  const scheduleForDay = selectedSportType.weeklySchedules.find(
    (ws) => ws.dayOfWeek === new Date(date).getDay()
  );

  if (!scheduleForDay) {
    setError("Розклад для обраного дня недоступний");
    return;
  }

  const [fromH, fromM, fromS] = scheduleForDay.availableFrom.split(":").map(Number);
  const [toH, toM, toS] = scheduleForDay.availableTo.split(":").map(Number);

  const availableFromDate = new Date(startTime);
  availableFromDate.setUTCHours(fromH, fromM, fromS, 0);

  const availableToDate = new Date(startTime);
  availableToDate.setUTCHours(toH, toM, toS, 0);

  if (startTime < availableFromDate || endTimeDate > availableToDate) {
    setError(
      `Бронювання доступне лише з ${scheduleForDay.availableFrom} до ${scheduleForDay.availableTo}`
    );
    return;
  }

  try {
    const response = await axios.post(
      "https://localhost:44313/api/Booking/check-availability",
      {
        sportsFieldId: court.id,
        startTime: startTime.toISOString(),
        durationMinutes: duration * 60,
      }
    );

    if (response.data) {
      const totalPrice = duration * selectedSportType.pricePerHour;
      onConfirm({
        court: court.title,
        location: court.location.address,
        sportType: getCorrectType(selectedSportType.type)?.name,
        date,
        time,
        duration,
        totalPrice,
        endTime: endTimeDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        }),
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

  // День тижня вибраної дати
  const dayOfWeek = date ? new Date(date).getDay() : null;
  console.log("Selected date:", date);
  console.log("Day of week:", dayOfWeek);
  console.log("Selected sport type:", selectedSportType);

   // Розклад на цей день для вибраного виду спорту
  const scheduleForDay = selectedSportType?.weeklySchedules?.find(
    (ws) => ws.dayOfWeek === dayOfWeek
  );
  console.log("Schedule for day:", scheduleForDay);

  // Генеруємо доступні часові інтервали згідно розкладу
  const availableTimes = generateTimeOptions(
    scheduleForDay?.availableFrom,
    scheduleForDay?.availableTo
  );
  console.log("Available times:", availableTimes);

  // Кінцевий час бронювання
  const startTime = time ? new Date(`${date}T${time}:00Z`) : null;
  const endTime = startTime
    ? new Date(startTime.getTime() + duration * 60 * 60 * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      })
    : "";

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h2>Бронювання корту</h2>
        <h2>{court.title}</h2>
        <p>Локація: {court.location.address}</p>

        <form onSubmit={handleSubmit}>
          <label>Вид спорту</label>
          <select
            className="date-select"
            value={selectedSportType?.type || ""}
            onChange={(e) => {
              const type = e.target.value;
              const typeObj = court.types.find((t) => String(t.type) === type);
              setSelectedSportType(typeObj || null);
              setTime(""); // скидаємо час при зміні виду спорту
            }}
            required
          >
            <option value="" disabled>
              Оберіть вид спорту
            </option>
            {court.types?.map((typeObj, index) => (
              <option key={index} value={typeObj.type}>
                {getCorrectType(typeObj.type)?.name || "Спорт"}
              </option>
            ))}
          </select>

          <label>Дата</label>
          <select
            className="date-select"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setTime(""); // скидаємо час при зміні дати
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
            disabled={!date || !selectedSportType || loading}
          >
            <option value="" disabled>
              Оберіть час
            </option>
            {availableTimes.length > 0 ? (
              availableTimes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))
            ) : (
              <option disabled>Немає доступного часу</option>
            )}
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
              <option key={hr} value={hr}>
                {hr} год
              </option>
            ))}
          </select>

          {time && (
            <p>
              Час бронювання: {time} - {endTime}
            </p>
          )}

          <p>
            Ціна за годину:{" "}
            {selectedSportType ? selectedSportType.pricePerHour : 0} грн
          </p>
          <p>
            Загальна вартість:{" "}
            <strong>
              {selectedSportType ? duration * selectedSportType.pricePerHour : 0} грн
            </strong>
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
