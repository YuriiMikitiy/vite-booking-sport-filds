import React, { useState } from 'react';
import CustomDropdown from '../../../HomaPage/InputSection/CustomDropdown';
import { timeOptions, durationOptions } from '../../../constants/timeOptions';
import { sports } from '../../../constants/sports';
import { cities } from '../../../constants/cities';
import './SearchFilters.css';

const SearchFilters = ({ searchParams, setSearchParams }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState({
    name: "All kinds of sport",
    icon: "/src/assets/images/ManySport.png",
  });

  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
    setIsOpen(false);
    const sportType = sport.name === "All kinds of sport" 
      ? null 
      : sports.findIndex(s => s.name === sport.name);
    setSearchParams(prev => ({ ...prev, type: sportType }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value.trim() || null
    }));
  };

  return (
    <div className="search-filters">
      <div className="sport-select-container">
        <div className="select-box" onClick={() => setIsOpen(!isOpen)}>
          <div className="select-box-content">
            <img src={selectedSport.icon} alt={selectedSport.name} />
            <span>{selectedSport.name}</span>
          </div>
          <span className="dropdown-arrow">▼</span>
        </div>
        
        <ul className={`select-dropdown ${isOpen ? "show" : ""}`}>
          <li onClick={() => handleSportSelect({
            name: "All kinds of sport",
            icon: "/src/assets/images/ManySport.png",
          })}>
            <img src="/src/assets/images/ManySport.png" alt="ManySport" />
            All kinds of sport
          </li>
          {sports.map((sport, index) => (
            <li key={index} onClick={() => handleSportSelect(sport)}>
              <img src={sport.icon} alt={sport.name} />
              {sport.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="date-input-container">
        <input
          type="date"
          name="date"
          className="date-input"
          onChange={handleInputChange}
        />
      </div>

      <CustomDropdown
        options={timeOptions}
        placeholder="Оберіть час"
        onSelect={(value) => setSearchParams(prev => ({ ...prev, startTime: value }))}
      />

      <CustomDropdown
        options={durationOptions}
        placeholder="Оберіть тривалість"
        onSelect={(value) => setSearchParams(prev => ({ ...prev, duration: value }))}
      />

      <input
        className="search-input"
        type="text"
        name="searchTitleOrAddres"
        placeholder="Пошук"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default React.memo(SearchFilters);