import React, { useEffect, useRef } from "react";
import "./UserProfileModal.css";

export default function UserProfileModal({ user, onClose }) {
  const modalRef = useRef();

  // Закриває модальне вікно при кліку поза його межами
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h2>Інформація про користувача</h2>
        <ul>
          {/* <li>
            <strong>ID:</strong> {user.id}
          </li>
          <li>
            <strong>Код користувача:</strong> {user.userCode}
          </li> */}
          <li>
            <strong>ПІБ:</strong> {user.fullName}{" "}
            <button onClick={() => alert("Зміна ПІБ буде додана пізніше")}>Змінити</button>
          </li>
          <li>
            <strong>Email:</strong> {user.email}{" "}
            <button onClick={() => alert("Зміна Email буде додана пізніше")}>Змінити</button>
          </li>
          <li>
            <strong>Телефон:</strong> {user.phoneNumber}{" "}
            <button onClick={() => alert("Зміна телефону буде додана пізніше")}>Змінити</button>
          </li>
          <li>
            <strong>Роль:</strong> {user.role==1 ? "Користувач" : "Адміністратор Майданчика"}
          </li>
          <li>
            <strong>Дата створення:</strong> {new Date(user.createdAt).toLocaleString()}
          </li>
        </ul>
        <button className="close-btn" onClick={onClose}>Закрити</button>
      </div>
    </div>
  );
}
