import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./UserProfileModal.css";

export default function UserProfileModal({ user, onClose }) {
  const modalRef = useRef();

  useEffect(() => {
    const handleMouseDownOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscClose = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleMouseDownOutside);
    document.addEventListener("keydown", handleEscClose);

    return () => {
      document.removeEventListener("mousedown", handleMouseDownOutside);
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [onClose]);

  const modal = (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h2 className="modal-title">Профіль користувача</h2>
        <ul className="user-info-list">
          <li className="user-info-item">
            <span className="info-label">ПІБ:</span>
            <span className="info-value">{user.fullName}</span>
            <button
              className="action-btn"
              onClick={() => alert("Зміна ПІБ буде додана пізніше")}
            >
              Змінити
            </button>
          </li>
          <li className="user-info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
            <button
              className="action-btn"
              onClick={() => alert("Зміна Email буде додана пізніше")}
            >
              Змінити
            </button>
          </li>
          <li className="user-info-item">
            <span className="info-label">Телефон:</span>
            <span className="info-value">{user.phoneNumber || "Не вказано"}</span>
            <button
              className="action-btn"
              onClick={() => alert("Зміна телефону буде додана пізніше")}
            >
              Змінити
            </button>
          </li>
          <li className="user-info-item">
            <span className="info-label">Роль:</span>
            <span className="info-value">
              {user.role === 1 ? "Користувач" : "Адміністратор Майданчика"}
            </span>
          </li>
          <li className="user-info-item">
            <span className="info-label">Створено:</span>
            <span className="info-value">{new Date(user.createdAt).toLocaleString()}</span>
          </li>
        </ul>
        <button className="close-btn" onClick={onClose}>
          Закрити
        </button>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
