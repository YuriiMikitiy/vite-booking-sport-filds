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
import React, { useEffect, useState, useContext } from "react";
import { LanguageContext } from "../../../assets/LanguageContext";

export default function CitySelector({
  cities,
  selectedCity,
  setSelectedCity,
  setSearchParams,
  setMapCenter,
  setCurrentPage,
  selectedSport,
}) {
  const { language, translations } = useContext(LanguageContext);
  const t = translations[language];
  const [selectWidth, setSelectWidth] = useState(100);

  const getSportDisplayName = (sport) => {
    if (sport.name === "All kinds of sport" || sport.key === "All") return t.sports.all;

    const mapping = {
      "Tennis": "tennis",
      "Badminton": "badminton",
      "Football field": "footballField",
      "Box": "box",
      "Ping Pong": "pingPong",
      "Biliard": "biliard",
      "Basketball": "basketball"
    };

    const translationKey = mapping[sport.key];
    return t.sports[translationKey] || sport.key;
  };

  // Функція для відображення назви міста з урахуванням "Всі міста"
  const getCityDisplayName = (city) => {
    // Якщо en === null або undefined, значить це пункт "Всі міста"
    if (!city.en) {
      if (language === 'uk') return "Всі міста";
      if (language === 'pl') return "Wszystkie miasta";
      return "All cities";
    }
    return language === 'uk' ? city.ua : city.en;
  };

  const measureText = (text) => {
    const selectEl = document.querySelector(".city-select");
    if (!selectEl) return 100;

    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.whiteSpace = "nowrap";
    span.style.fontWeight = "bold";
    span.style.fontSize = window.getComputedStyle(selectEl).fontSize;
    span.innerText = text;
    document.body.appendChild(span);
    const width = span.offsetWidth + 40;
    document.body.removeChild(span);
    return width;
  };

  const handleCitySelect = (val) => {
    // Шукаємо місто в масиві. Перевіряємо і ua, і en назви
    const selected = cities.find((city) => {
      const translatedName = getCityDisplayName(city);
      return city.ua === val || city.en === val || translatedName === val;
    });

    if (selected) {
      setSelectedCity(selected);
      // Якщо обрано "Всі міста" (en === null), то в пошук піде null, що скине фільтр
      setSearchParams((prev) => ({ ...prev, city: selected.en }));
      setCurrentPage(1);
      setMapCenter(selected.coordinates);
    }
  };

  useEffect(() => {
    setSelectWidth(measureText(getCityDisplayName(selectedCity)));
  }, [selectedCity, language]);

  return (
    <h2>
      {getSportDisplayName(selectedSport)}{t.citySelector.inCity}&nbsp;
      <select
        value={getCityDisplayName(selectedCity)}
        onChange={(e) => handleCitySelect(e.target.value)}
        className="city-select"
        style={{ "--select-width": `${selectWidth}px` }}
      >
        {cities.map((city, index) => (
          <option key={index} value={getCityDisplayName(city)}>
            {getCityDisplayName(city)}
          </option>
        ))}
      </select>
    </h2>
  );
}