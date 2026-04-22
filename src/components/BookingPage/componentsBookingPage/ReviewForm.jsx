import React, { useContext, useState } from "react";
import axios from "axios";
import { LanguageContext } from "../../../assets/LanguageContext";
import { useToast } from "../../../context/ToastContext.jsx";
import { API_BASE } from "../../../config/api.js";
import "./ReviewForm.css";

const MAX_COMMENT_LENGTH = 300;

export default function ReviewForm({ 
  sportsFieldId, 
  bookingId = null,     // ← додаємо пропс з значенням за замовчуванням
  onReviewAdded, 
  onClose 
}) {
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hovered, setHovered] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { language, translations } = useContext(LanguageContext);
  const t = translations[language];
  const { showToast } = useToast();

  const activeStars = hovered > 0 ? hovered : rating;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError(t.reviewForm.authRequired || "Потрібно увійти в акаунт");
        return;
      }

      console.log("Відправляємо відгук:", { sportsFieldId, userId, bookingId, rating });

      await axios.post(`${API_BASE}/reviews`, {
        sportsFieldId,
        userId,
        bookingId: bookingId || null,        // передаємо bookingId, якщо є
        rating,
        comment: comment.trim() || null,
      });

      showToast(t.reviewForm.success || "Дякуємо! Ваш відгук успішно додано.", "success");
      
      if (onReviewAdded) onReviewAdded();
      if (onClose) onClose();

    } catch (err) {
      console.error("Помилка при відправці відгуку:", err.response?.data || err);
      
      if (err.response?.status === 400) {
        setError(err.response.data?.message || "Ви вже залишили відгук на це бронювання");
      } else if (err.response?.status === 401) {
        setError(t.reviewForm.authRequired || "Сесія закінчилася. Увійдіть знову.");
      } else {
        setError(err.response?.data?.message || "Не вдалося додати відгук. Спробуйте пізніше.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h4 className="review-form-title">
        {t.reviewForm.title || "Залишити відгук"}
      </h4>

      <label className="review-form-label">
        {t.reviewForm.ratingLabel || "Ваша оцінка"}
      </label>
      
      <div className="review-stars" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            className={`review-star ${value <= activeStars ? "active" : ""}`}
            onMouseEnter={() => setHovered(value)}
            onClick={() => setRating(value)}
          >
            ★
          </button>
        ))}
      </div>

      <label className="review-form-label">
        {t.reviewForm.commentLabel || "Коментар"}
      </label>
      <textarea
        className="review-textarea"
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
        placeholder={t.reviewForm.commentPlaceholder || "Напишіть ваш відгук..."}
        rows={4}
      />

      <div className="review-counter">
        {comment.length} / {MAX_COMMENT_LENGTH}
      </div>

      {error && <p className="review-error">{error}</p>}

      <div className="review-actions">
        <button
          type="button"
          className="review-cancel-btn"
          onClick={onClose}
          disabled={loading}
        >
          {t.reviewForm.cancel || "Скасувати"}
        </button>

        <button
          type="submit"
          className="review-submit-btn"
          disabled={loading || !comment.trim()}
        >
          {loading 
            ? (t.reviewForm.submitting || "Відправка...") 
            : (t.reviewForm.submit || "Надіслати відгук")
          }
        </button>
      </div>
    </form>
  );
}