import React, { useState } from "react";
import './TimeDropdown.css'

const TimeDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("Будь-який час");

  const timeOptions = [
    "Будь-який час",
    "з 00:30",
    "з 01:00",
    "з 01:30",
    "з 02:00",
    "з 02:30",
  ];

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
        {selectedTime}
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
        {timeOptions.map((time, index) => (
          <li
            key={index}
            onClick={() => {
              setSelectedTime(time);
              setIsOpen(false);
            }}
            style={{
              padding: "10px",
              cursor: "pointer",
              borderBottom: index !== timeOptions.length - 1 ? "1px solid #eee" : "none",
            }}
          >
            {time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeDropdown;