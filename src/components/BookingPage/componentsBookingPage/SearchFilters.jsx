import React, { useState, useContext } from "react";
import { LanguageContext } from "../../../assets/LanguageContext.jsx"; // Перевір шлях до контексту
import CustomDropdown from "../../HomaPage/InputSection/CustomDropdown.jsx";
import { timeOptions, durationOptions, sports } from "../../HomaPage/InputSection/dateTime.js";

export default function SearchFilters({ selectedSport, setSelectedSport, setSearchParams, setCurrentPage }) {
  const { language, translations } = useContext(LanguageContext);
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);

  // Функція для відображення назви спорту залежно від обраної мови
  const getSportDisplayName = (sport) => {
    if (sport.name === "All kinds of sport") return t.sports.all;
    
    // Мапінг англійських назв з dateTime.js на ключі перекладів
    const mapping = {
      "Tennis": "tennis",
      "Badminton": "badminton",
      "Football field": "footballField",
      "Box": "box",
      "Ping Pong": "pingPong",
      "Billiards": "biliard",
      "Basketball": "basketball"
    };
    
    const key = mapping[sport.key];
    return t.sports[key] || sport.key;
  };

  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
    setIsOpen(false);
    const sportType =
      sport.name === "All kinds of sport"
        ? null
        : sports.findIndex((s) => s.name === sport.name);
    setSearchParams((prev) => ({ ...prev, type: sportType }));
    setCurrentPage(1);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value.trim();
    setSearchParams((prev) => ({
      ...prev,
      searchTitleOrAddres: value || null,
    }));
    setCurrentPage(1);
  };

  const handleDateSelect = (e) => {
    const value = e.target.value || null;
    setSearchParams((prev) => ({ ...prev, date: value }));
    setCurrentPage(1);
  };

  const handleTimeSelect = (value) => {
    setSearchParams((prev) => ({ ...prev, startTime: value || null }));
    setCurrentPage(1);
  };

  const handleDurationSelect = (value) => {
    setSearchParams((prev) => ({ ...prev, duration: value || null }));
    setCurrentPage(1);
  };

  return (
    <>
      <div className="search-fields">
        <div className="select-container">
          <div
            className="select-box"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="selected-sport-value">
              <img
                src={selectedSport.icon || "/src/assets/images/default-sport.png"}
                alt={selectedSport.name}
                className="selected-icon"
              />
              <span>{getSportDisplayName(selectedSport)}</span>
            </div>
            <span className="select-box-arrow">▼</span>
          </div>
          <ul className={`select-dropdown ${isOpen ? "show" : ""}`}>
            <li
              onClick={() =>
                handleSportSelect({
                  name: "All kinds of sport",
                  icon: "/src/assets/images/ManySport.png",
                })
              }
            >
              <img src="/src/assets/images/ManySport.png" alt="ManySport" />
              {t.sports.all}
            </li>
            {sports.map((sport, index) => (
              <li
                key={index}
                onClick={() => handleSportSelect(sport)}
              >
                <img
                  src={sport.icon || "/src/assets/images/default-sport.png"}
                  alt={sport.name}
                />
                {getSportDisplayName(sport)}
              </li>
            ))}
          </ul>
        </div>
        <div className="select-container-date">
          <input
            type="date"
            className="date-input"
            onChange={handleDateSelect}
          />
        </div>
        <CustomDropdown
          options={timeOptions}
          placeholder={t.bookingModal.chooseTimePlaceholder}
          onSelect={handleTimeSelect}
        />
        <CustomDropdown
          style={{ display: "none" }}
          options={durationOptions}
          placeholder="Duration"
          onSelect={handleDurationSelect}
        />
      </div>
      <input
        className="search-input"
        type="text"
        placeholder={t.inputSection.searchPlaceholder}
        onChange={handleSearchInput}
      />
    </>
  );
}