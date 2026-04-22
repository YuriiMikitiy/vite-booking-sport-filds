// import React, { useContext } from "react";
// import { LanguageContext } from "../../../../assets/LanguageContext"; // Перевір шлях до контексту
// import { getCorrectType } from "../../BookingPage"; 

// const CourtCard = ({ courts, setSelectedCourt, handleShowOnMap }) => {
//   const { language, translations } = useContext(LanguageContext);
//   const t = translations[language];

//   // Функція для отримання перекладеної назви спорту для тегів
//   const getTranslatedSportName = (typeId) => {
//     const sportInfo = getCorrectType(typeId);
//     if (!sportInfo) return "Спорт";

//     const mapping = {
//       "Tennis": "tennis",
//       "Badminton": "badminton",
//       "Football field": "footballField",
//       "Box": "box",
//       "Ping Pong": "pingPong",
//       "Biliard": "biliard",
//       "Basketball": "basketball"
//     };

//     const translationKey = mapping[sportInfo.key];
//     return t.sports[translationKey] || sportInfo.key;
//   };

//   return (
//     <div style={{ marginBottom: "50px" }}>
//       {courts.map((court) => (
//         <div className="card" key={court.id}>
//           <div className="card-image-container">
//             <img
//               src={
//                 court.imageUrl ||
//                 "/src/assets/images/default-image-for-sport-field.jpg"
//               }
//               onError={(e) =>
//                 (e.target.src =
//                   "/src/assets/images/default-image-for-sport-field.png")
//               }
//               className="card-image"
//               alt={court.title}
//             />
//             <div className="image-badges">
//               <span className="badge red">{t.courtCard.noCommission}</span>
//               <span className="badge yellow">{t.courtCard.online}</span>
//             </div>
//           </div>
//           <div className="card-info">
//             <h3>{court.title}</h3>
//             <p>{court.location?.address ?? (language === 'uk' ? "Немає" : "No address")}</p>

//             {/* Відображення всіх видів спорту */}
//             <div className="tags">
//               {court.types?.map((sportType, index) => {
//                 const sportInfo = getCorrectType(sportType.type);
//                 return (
//                   <span className="tag" key={index}>
//                     <img
//                       src={sportInfo?.icon || "/src/assets/images/default-sport.png"}
//                       alt={sportInfo?.key || "Sport"}
//                       width="16"
//                     />{" "}
//                     {getTranslatedSportName(sportType.type)}
//                   </span>
//                 );
//               })}
//             </div>

//             {court.warningInformation && (
//               <p className="warning">⚠️{court.warningInformation}</p>
//             )}
            
//             <p className="description">
//               {t.courtCard.bookFast}
//             </p>

//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <button
//                 className="book-button highlight"
//                 onClick={() => setSelectedCourt(court)}
//               >
//                 {t.courtCard.bookButton.split('→')[0]} →{" "}
//                 <div
//                   style={{
//                     backgroundColor: "Blue",
//                     padding: "8px",
//                     borderRadius: "15px",
//                     margin: "0px",
//                     display: "inline-block",
//                     color: "white"
//                   }}
//                 >
//                   {t.courtCard.book}
//                 </div>
//               </button>
//               <button
//                 className="show-on-map-button"
//                 onClick={() =>
//                   handleShowOnMap([
//                     court.location.latitude,
//                     court.location.longitude,
//                   ])
//                 }
//               >
//                 {t.courtCard.showOnMap}
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CourtCard;


import React, { useContext } from "react";
import { LanguageContext } from "../../../../assets/LanguageContext";
import { getCorrectType } from "../../../../utils/sportFieldType.js";
import NativeMapLink from "../../../common/NativeMapLink.jsx";

const CourtCard = ({ courts, setSelectedCourt, handleShowOnMap }) => {
  const { language, translations } = useContext(LanguageContext);
  const t = translations[language];

   // Функція для отримання перекладеної назви спорту для тегів
  const getTranslatedSportName = (typeId) => {
    const sportInfo = getCorrectType(typeId);
    if (!sportInfo) return "Спорт";

    const mapping = {
      "Tennis": "tennis",
      "Badminton": "badminton",
      "Football field": "footballField",
      "Box": "box",
      "Ping Pong": "pingPong",
      "Biliard": "biliard",
      "Basketball": "basketball"
    };

    const translationKey = mapping[sportInfo.key];
    return t.sports[translationKey] || sportInfo.key;
  };
  // Функція для рендеру зірок через emoji
  const renderStars = (rating) => {
    if (!rating || rating <= 0) return null;

    

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="rating-stars">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star-full">★</span>
        ))}
        
        {hasHalfStar && (
          <span className="star-full">★</span>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star-empty">★</span>
        ))}

        <span className="rating-value">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div style={{ marginBottom: "50px" }}>
      {courts.map((court) => (
        <div className="court-card" key={court.id}>
          <div className="card-image-container">
            <img
              src={court.imageUrl || "/src/assets/images/default-image-for-sport-field.jpg"}
              onError={(e) => (e.target.src = "/src/assets/images/default-image-for-sport-field.png")}
              className="card-image"
              alt={court.title}
            />
            <div className="image-badges">
              <span className="badge red">{t.courtCard.noCommission}</span>
              <span className="badge yellow">{t.courtCard.online}</span>
            </div>
          </div>

          <div className="card-info">
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "flex-start",
              marginBottom: "8px"
            }}>
              <h3>{court.title}</h3>

              <div className="rating-wrap">
              {court.averageRating > 0 ? (
                <>
                  {renderStars(court.averageRating)}
                  {court.reviewCount > 0 && (
                    <p className="rating-count">
                      {court.reviewCount} {language === 'uk' ? "відгуків" : "reviews"}
                    </p>
                  )}
                </>
              ) : (
                <p className="rating-empty">{language === "uk" ? "Ще немає оцінок" : "No reviews yet"}</p>
              )}
              </div>
            </div>

            <p>{court.location?.address ?? (language === 'uk' ? "Немає адреси" : "No address")}</p>

            {/* Види спорту */}
            <div className="tags">
              {court.types?.map((sportType, index) => {
                const sportInfo = getCorrectType(sportType.type);
                return (
                  <span className="tag" key={index}>
                    <img
                      src={sportInfo?.icon || "/src/assets/images/default-sport.png"}
                      alt={sportInfo?.key || "Sport"}
                      width="16"
                    />{" "}
                    {getTranslatedSportName(sportType.type)}
                  </span>
                );
              })}
            </div>

            {court.warningInformation && (
              <p className="warning">⚠️ {court.warningInformation}</p>
            )}

            <p className="description">{t.courtCard.bookFast}</p>

            <div className="court-card-actions">
              <button
                type="button"
                className="book-button highlight"
                onClick={() => setSelectedCourt(court)}
              >
                {t.courtCard.bookButton.split("→")[0]} →
                <div
                  style={{
                    backgroundColor: "#1976d2",
                    padding: "8px 14px",
                    borderRadius: "15px",
                    display: "inline-block",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {t.courtCard.book}
                </div>
              </button>

              <NativeMapLink
                lat={court.location?.latitude}
                lng={court.location?.longitude}
                label={court.title}
                className="show-on-map-button"
                onDesktopAction={() =>
                  handleShowOnMap([
                    court.location?.latitude,
                    court.location?.longitude,
                  ])
                }
              >
                {t.courtCard.showOnMap}
              </NativeMapLink>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourtCard;