import React, { useState } from "react";
import CustomDropdown from "../../HomaPage/InputSection/CustomDropdown.jsx";
import { timeOptions, durationOptions, sports } from "../../HomaPage/InputSection/dateTime.js";
// "../HomaPage/InputSection/dateTime";

export default function SearchFilters({ selectedSport, setSelectedSport, setSearchParams, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);

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
        <div className="select-container" style={{ marginLeft: "12px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
              paddingRight: "20px",
              width: "100%",
            }}
            className="select-box"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={selectedSport.icon || "/src/assets/images/default-sport.png"}
                alt={selectedSport.name}
                className="selected-icon"
              />
              <span>{selectedSport.name}</span>
            </div>
            <span style={{ position: "absolute", right: "20px" }}>▼</span>
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
              All kinds of sport
            </li>
            {sports.map((sport, index) => (
              <li
                key={index}
                onClick={() => {
                  handleSportSelect(sport);
                  setIsOpen(false);
                }}
              >
                <img
                  src={sport.icon || "/src/assets/images/default-sport.png"}
                  alt={sport.name}
                />
                {sport.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="select-container-date">
          <input
            type="date"
            className="date-input"
            placeholder="Select date"
            onChange={handleDateSelect}
          />
        </div>
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
      </div>
      <input
        className="search-input"
        type="text"
        placeholder="Пошук"
        onChange={handleSearchInput}
      />
    </>
  );
}