import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import "../components/common/Toast.css";

const ToastContext = createContext(null);

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (message, variant = "info", duration = 4200) => {
      const id = makeId();
      const text = message == null ? "" : String(message);
      setToasts((prev) => [...prev, { id, message: text, variant }]);
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({ showToast, dismiss, dismissAll }),
    [showToast, dismiss, dismissAll]
  );

  /* Портал у document.body останнім шаром — уникаємо обрізання/контексту #toast-root */
  const toastHost =
    typeof document !== "undefined" ? document.body : null;

  useEffect(() => {
    if (toasts.length === 0) return;
    const onKey = (e) => {
      if (e.key === "Escape") dismissAll();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [toasts.length, dismissAll]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toastHost &&
        createPortal(
          toasts.length > 0 ? (
            <div
              className="app-toast-overlay"
              role="presentation"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) dismissAll();
              }}
            >
              <div
                className="app-toast-overlay__inner"
                role="group"
                aria-label="Повідомлення"
              >
                {toasts.map((t) => (
                  <div
                    key={t.id}
                    className={`app-toast app-toast--${t.variant}`}
                    role="alert"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <span className="app-toast__text">{t.message}</span>
                    <button
                      type="button"
                      className="app-toast__close"
                      aria-label="Закрити"
                      onClick={() => dismiss(t.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null,
          toastHost
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
