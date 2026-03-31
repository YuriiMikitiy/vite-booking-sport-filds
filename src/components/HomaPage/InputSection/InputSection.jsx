import { useState } from "react";
import "./InputSection.css";
import "react-datepicker/dist/react-datepicker.css";
import TimeDropdown from "./TimeDropdown.jsx";
import CustomDropdown from "./CustomDropdown.jsx";
import { timeOptions, durationOptions, sports } from "./dateTime.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
// Приклад з Header.jsx (якщо Header лежить у src/components/Header/)
// Якщо файл лежить у src/contexts/LanguageContext.jsx
import { LanguageContext } from "../../../assets/LanguageContext.jsx";


export default function InputSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState({
    name: "Tennis",
    icon: "https://cdn4.iconfinder.com/data/icons/sports-flat-2/48/Tennis-512.png",
  });

  const navigate = useNavigate();

  const { language, setLanguage, translations } = useContext(LanguageContext);
  const t = translations[language];
  const handleTimeSelect = (value) => {
    console.log("Обраний час:", value);
  };

  const handleDurationSelect = (value) => {
    console.log("Обрана тривалість:", value);
  };

  return (
    <div style={{ display: "flex" }}>
      <div className="inputSection">
        <div style={{ display: "flex", gap: "44px" }}>
          {/* ------------------------------------------------------ */}
          <div className="select-container">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative", // Додаємо для позиціонування стрілки
                paddingRight: "20px", // Забезпечуємо місце для стрілки
                width: "100%", // Займає всю доступну ширину
              }}
              className="select-box"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={selectedSport.icon}
                  alt={selectedSport.name}
                  className="selected-icon"
                />
                <span>{selectedSport.name}</span>
              </div>
              <span
                style={{
                  position: "absolute",
                  right: "20px", // Фіксуємо стрілку 20px від правого краю
                }}
              >
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
                <img src="/src/assets/images/ManySport.png" alt="ManySport" />
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
                  <img src={sport.icon} alt={sport.name} /> {sport.name}
                </li>
              ))}
            </ul>
          </div>
          {/* ------------------------------------------------------ */}
          <div className="select-container2">
            <div className="find-box">
              <img
                src="https://cdn0.iconfinder.com/data/icons/multimedia-solid-30px/30/search-128.png"
                alt="Search"
                className="search-icon"
              />
              <input
                placeholder={t.inputSection.searchPlaceholder}
                className="search-input"
                type="text"
              />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "26px" }}>
          <div className="select-container-date">
            <input
              type="date"
              className="date-input"
              placeholder="Select date"
            />
          </div>
          {/* ------------------------------------------------------ */}

          {/* ------------------------------------------------------ */}

          <CustomDropdown
            options={timeOptions}
            placeholder="Оберіть час"
            onSelect={handleTimeSelect}
          />
          <CustomDropdown
            options={durationOptions}
            placeholder="Оберіть тривалість"
            onSelect={handleDurationSelect}
          />
          <div className="search-wrapper">
            <button onClick={() => navigate("/booking")} className="search-btn">
              {t.inputSection.searchBtn}
            </button>

            <div className="search-hint" role="note" aria-label="Підказка для пошуку">
              <div className="search-hint-bubble">
                {t.inputSection.searchHint}
              </div>
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
      <img
        style={{ with: "292px", height: "458px" }}
        className="h-10 w-10"
        src="/src/assets/images/2sport-children.png"
        alt="2sport-children"
      />
    </div>
  );
}
