// import React, { useEffect, useState } from "react";

// export default function CitySelector({
//   cities,
//   selectedCity,
//   setSelectedCity,
//   setSearchParams,
//   setMapCenter,
//   setCurrentPage,
// }) {
//   const [selectWidth, setSelectWidth] = useState(100);

//   const measureText = (text) => {
//     const span = document.createElement("span");
//     span.style.visibility = "hidden";
//     span.style.whiteSpace = "nowrap";
//     span.style.fontWeight = "bold";
//     span.style.fontSize = window.getComputedStyle(
//       document.querySelector(".city-select")
//     ).fontSize;
//     span.innerText = text;
//     document.body.appendChild(span);
//     const width = span.offsetWidth + 30;
//     document.body.removeChild(span);
//     return width;
//   };

//   const handleCitySelect = (uaCity) => {
//     const selected = cities.find((city) => city.ua === uaCity);
//     if (selected) {
//       setSelectedCity(selected);
//       setSearchParams((prev) => ({ ...prev, city: selected.en }));
//       setCurrentPage(1);
//       setMapCenter(selected.coordinates);
//     }
//   };

//   useEffect(() => {
//     setSelectWidth(measureText(selectedCity.ua));
//   }, [selectedCity.ua]);

//   return (
//     <h2>
//       <select
//         value={selectedCity.ua}
//         onChange={(e) => handleCitySelect(e.target.value)}
//         className="city-select"
//         style={{ "--select-width": `${selectWidth}px` }}
//       >
//         {cities.map((city) => (
//           <option key={city.en} value={city.ua}>
//             {city.ua}
//           </option>
//         ))}
//       </select>
//     </h2>
//   );
// }

import React, { useEffect, useState } from "react";

export default function CitySelector({
  cities,
  selectedCity,
  setSelectedCity,
  setSearchParams,
  setMapCenter,
  setCurrentPage,
  selectedSport,
}) {
  const [selectWidth, setSelectWidth] = useState(100);

  const measureText = (text) => {
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.whiteSpace = "nowrap";
    span.style.fontWeight = "bold";
    span.style.fontSize = window.getComputedStyle(
      document.querySelector(".city-select")
    ).fontSize;
    span.innerText = text;
    document.body.appendChild(span);
    const width = span.offsetWidth + 30;
    document.body.removeChild(span);
    return width;
  };

  const handleCitySelect = (uaCity) => {
    const selected = cities.find((city) => city.ua === uaCity);
    if (selected) {
      setSelectedCity(selected);
      setSearchParams((prev) => ({ ...prev, city: selected.en }));
      setCurrentPage(1);
      setMapCenter(selected.coordinates);
    }
  };

  useEffect(() => {
    setSelectWidth(measureText(selectedCity.ua));
  }, [selectedCity.ua]);

  return (
    <h2>

      {selectedSport.name} в м.&nbsp;
      <select
        value={selectedCity.ua}
        onChange={(e) => handleCitySelect(e.target.value)}
        className="city-select"
        style={{ "--select-width": `${selectWidth}px` }}
      >
        {cities.map((city) => (
          <option key={city.en} value={city.ua}>
            {city.ua}
          </option>
        ))}
      </select>
    </h2>
  );
}