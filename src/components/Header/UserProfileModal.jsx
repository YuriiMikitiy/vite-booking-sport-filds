import React, { useEffect, useRef, useContext } from "react";
import { createPortal } from "react-dom";
import { LanguageContext } from "../../assets/LanguageContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useModalBodyLock } from "../../hooks/useModalBodyLock.js";
import "./UserProfileModal.css";

export default function UserProfileModal({ user, onClose }) {
  const modalRef = useRef();
  useModalBodyLock(true);
  const { language, translations } = useContext(LanguageContext);
  const t = translations[language];
  const { showToast } = useToast();

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

  const comingSoon = () => {
    showToast(t.profileModal.changeLater, "info");
  };

  const modal = (
    <div className="app-modal-overlay">
      <div className="app-modal-panel app-modal-panel--wide" ref={modalRef}>
        <h2 className="app-modal-title">{t.profileModal.title}</h2>
        <ul className="user-info-list">
          <li className="user-info-item">
            <span className="info-label">{t.profileModal.fullNameLabel}</span>
            <span className="info-value">{user.fullName}</span>
            <button type="button" className="action-btn" onClick={comingSoon}>
              {t.profileModal.change}
            </button>
          </li>
          <li className="user-info-item">
            <span className="info-label">{t.profileModal.emailLabel}</span>
            <span className="info-value">{user.email}</span>
            <button type="button" className="action-btn" onClick={comingSoon}>
              {t.profileModal.change}
            </button>
          </li>
          <li className="user-info-item">
            <span className="info-label">{t.profileModal.phoneLabel}</span>
            <span className="info-value">{user.phoneNumber || "—"}</span>
            <button type="button" className="action-btn" onClick={comingSoon}>
              {t.profileModal.change}
            </button>
          </li>
          <li className="user-info-item">
            <span className="info-label">{t.profileModal.roleLabel}</span>
            <span className="info-value">
              {user.role === 1 ? t.profileModal.userRole : t.profileModal.adminRole}
            </span>
          </li>
          <li className="user-info-item">
            <span className="info-label">{t.profileModal.createdLabel}</span>
            <span className="info-value">{new Date(user.createdAt).toLocaleString()}</span>
          </li>
        </ul>
        <button type="button" className="close-btn" onClick={onClose}>
          {t.profileModal.close}
        </button>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
