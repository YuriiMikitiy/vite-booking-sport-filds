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
    <div className="select-container-time-at" style={{ position: "relative", width: "200px" }}>
      <div
        className="select-box-time-at"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "15px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {selected}
        <span style={{ marginLeft: "10px" }}>▼</span>
      </div>
      <ul
        className={`select-dropdown-time-at ${isOpen ? "show" : ""}`}
        style={{
          display: isOpen ? "block" : "none",
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          border: "1px solid #ccc",
          borderRadius: "15px",
          backgroundColor: "#fff",
          listStyle: "none",
          padding: 0,
          margin: 0,
          zIndex: 1000,
          maxHeight: "200px",
          overflowY: "auto",
        }}
      >
        {options.map((option, index) => (
          <li
            key={index}
            onClick={() => handleSelect(option)}
            style={{
              padding: "10px",
              cursor: "pointer",
              borderBottom: index !== options.length - 1 ? "1px solid #eee" : "none",
            }}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomDropdown;
