import React, { useState } from "react";
import "./TimeDropdown.css";

const CustomDropdown = ({ options, placeholder = "Оберіть...", onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(placeholder);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelect) onSelect(option);
  };

  return (
    <div className="select-container-time-at">
      <div
        className="select-box-time-at"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="select-box-time-at-value">{selected}</span>
        <span className="select-box-time-at-arrow">▼</span>
      </div>
      <ul
        className={`select-dropdown-time-at ${isOpen ? "show" : ""}`}
      >
        {options.map((option, index) => (
          <li
            key={index}
            onClick={() => handleSelect(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomDropdown;
