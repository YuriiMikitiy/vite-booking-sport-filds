import { useState } from "react";
import "./InputSection.css";
import "react-datepicker/dist/react-datepicker.css";
import TimeDropdown from "./TimeDropdown.jsx";
import CustomDropdown from "./CustomDropdown.jsx";
import { timeOptions, durationOptions, sports } from "./dateTime.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LanguageContext } from "../../../assets/LanguageContext.jsx";

export default function InputSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState({
    name: "Tennis",
    icon: "https://cdn4.iconfinder.com/data/icons/sports-flat-2/48/Tennis-512.png",
  });

  const navigate = useNavigate();

  const { language, translations } = useContext(LanguageContext);
  const t = translations[language];

  const handleTimeSelect = (value) => {
    console.log("Обраний час:", value);
  };

  const handleDurationSelect = (value) => {
    console.log("Обрана тривалість:", value);
  };

  return (
    <section className="home-search" aria-label={t.inputSection.searchPlaceholder}>
      <div className="home-search__row home-search__row--primary">
        <div className="home-search__field home-search__field--sport">
          <div className="select-container">
            <div
              className="select-box"
              onClick={() => setIsOpen(!isOpen)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsOpen(!isOpen);
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
            >
              <div className="home-search__sport-inner">
                <img
                  src={selectedSport.icon}
                  alt=""
                  className="selected-icon"
                />
                <span className="selected-sport-value">{selectedSport.name}</span>
              </div>
              <span className="select-box-arrow" aria-hidden>
                ▼
              </span>
            </div>
            <ul className={`select-dropdown ${isOpen ? "show" : ""}`}>
              <li
                onClick={() => {
                  setSelectedSport({
                    name: "All kinds of sport",
                    icon: "/src/assets/images/ManySport.png",
                  });
                  setIsOpen(false);
                }}
              >
                <img src="/src/assets/images/ManySport.png" alt="" />
                All kinds of sport
              </li>
              {sports.map((sport, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSelectedSport(sport);
                    setIsOpen(false);
                  }}
                >
                  <img src={sport.icon} alt="" /> {sport.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="home-search__field home-search__field--search">
          <div className="find-box">
            <img
              src="https://cdn0.iconfinder.com/data/icons/multimedia-solid-30px/30/search-128.png"
              alt=""
              className="search-icon"
            />
            <input
              placeholder={t.inputSection.searchPlaceholder}
              className="search-input"
              type="search"
              enterKeyHint="search"
            />
          </div>
        </div>
      </div>

      <div className="home-search__row home-search__row--secondary">
        <div className="home-search__field home-search__field--date">
          <div className="select-container-date">
            <input type="date" className="date-input" />
          </div>
        </div>

        <div className="home-search__field home-search__field--time">
          <CustomDropdown
            options={timeOptions}
            placeholder="Оберіть час"
            onSelect={handleTimeSelect}
          />
        </div>

        <div className="home-search__field home-search__field--duration">
          <CustomDropdown
            options={durationOptions}
            placeholder="Оберіть тривалість"
            onSelect={handleDurationSelect}
          />
        </div>

        <div className="home-search__field home-search__field--submit">
          <div className="search-wrapper">
            <button
              type="button"
              onClick={() => navigate("/booking")}
              className="search-btn"
            >
              {t.inputSection.searchBtn}
            </button>

            <div
              className="search-hint"
              role="note"
              aria-label={t.inputSection.searchHint}
            >
              <div className="search-hint-bubble">{t.inputSection.searchHint}</div>
              <svg
                className="search-hint-arrow"
                viewBox="0 0 120 60"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M100,40 C78,12 40,44 12,4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M15,5 L44,14 M12,5 L15,25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
