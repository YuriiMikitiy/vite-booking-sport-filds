import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useModalBodyLock } from "../../hooks/useModalBodyLock.js";
import "./MapFullscreenModal.css";

export default function MapFullscreenModal({
  title,
  children,
  onClose,
  externalUrl,
  externalLabel,
  closeLabel,
}) {
  useModalBodyLock(true);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="map-fullscreen-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="map-fullscreen-panel">
        <header className="map-fullscreen-topbar">
          <button
            type="button"
            className="map-fullscreen-icon-btn"
            onClick={onClose}
            aria-label={closeLabel}
          >
            <span className="map-fullscreen-close-icon" aria-hidden>
              ×
            </span>
          </button>
          <h2 className="map-fullscreen-heading">{title}</h2>
          {externalUrl ? (
            <a
              className="map-fullscreen-link"
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {externalLabel}
            </a>
          ) : (
            <span className="map-fullscreen-link map-fullscreen-link--placeholder" />
          )}
        </header>
        <div className="map-fullscreen-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
