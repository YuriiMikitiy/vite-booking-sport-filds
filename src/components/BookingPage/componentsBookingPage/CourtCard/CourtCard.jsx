import React from 'react';
import { getCorrectType } from '../../BookingPage'; // Assuming getCorrectType is exported from BookingPage

const CourtCard = ({ courts, selectedSport, setSelectedCourt, setSelectedSportType, handleShowOnMap }) => {
  return (
    <div style={{ marginBottom: '50px' }}>
      {courts.map((court) => (
        <div className="card" key={court.id}>
          <div className="card-image-container">
            <img
              src={court.imageUrl || '/src/assets/images/default-court.jpg'}
              alt={court.title}
              className="card-image"
            />
            <div className="image-badges">
              <span className="badge red">❤️ Без комісії</span>
              <span className="badge yellow">⚡ Онлайн</span>
            </div>
          </div>
          <div className="card-info">
            <h3>{court.title}</h3>
            <p>{court.location.address}</p>
            <div className="tags">
              <span className="tag">
                <img
                  src={getCorrectType(court.type)?.icon || '/src/assets/images/default-sport.png'}
                  alt={selectedSport.name}
                  width="20"
                />{' '}
                {getCorrectType(court.type)?.name || 'Спорт'}
              </span>
            </div>
            {court.warningInformation && (
              <p className="warning">⚠️{court.warningInformation}</p>
            )}
            <p className="description">
              У цьому клубі можна забронювати корт менше ніж за 1 хвилину
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <button
                className="book-button highlight"
                onClick={() => {
                  setSelectedCourt(court);
                  setSelectedSportType(selectedSport.name);
                }}
              >
                ⚡ Забронювати майданчик у кілька кліків тут →{' '}
                <div
                  style={{
                    backgroundColor: 'Blue',
                    padding: '8px',
                    borderRadius: '15px',
                    margin: '0px',
                  }}
                >
                  Забронювати
                </div>
              </button>
              <button
                className="show-on-map-button"
                onClick={() => handleShowOnMap([court.location.latitude, court.location.longitude])}
              >
                Показати на карті
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourtCard;


// import React from 'react';
// import { getCorrectType } from '../../../utils/sportUtils';
// import './CourtCard.css';

// const CourtCard = ({ court, onBook, onShowOnMap }) => {
//   const sportType = getCorrectType(court.type);
  
//   return (
//     <div className="court-card">
//       <div className="card-image-container">
//         <img
//           src={court.imageUrl || "/src/assets/images/default-court.jpg"}
//           alt={court.title}
//           className="card-image"
//           loading="lazy"
//         />
//         <div className="image-badges">
//           <span className="badge red">❤️ Без комісії</span>
//           <span className="badge yellow">⚡ Онлайн</span>
//         </div>
//       </div>
      
//       <div className="card-info">
//         <h3>{court.title}</h3>
//         <p className="card-address">{court.location.address}</p>
        
//         <div className="tags">
//           <span className="tag">
//             <img 
//               src={sportType?.icon} 
//               alt={sportType?.name} 
//               width="20" 
//               height="20"
//             />
//             {sportType?.name || "Спорт"}
//           </span>
//         </div>
        
//         {court.warningInformation && (
//           <p className="warning">⚠️ {court.warningInformation}</p>
//         )}
        
//         <p className="description">
//           У цьому клубі можна забронювати корт менше ніж за 1 хвилину
//         </p>
        
//         <div className="card-actions">
//           <button 
//             className="book-button highlight"
//             onClick={() => onBook(court)}
//             aria-label={`Забронювати ${court.title}`}
//           >
//             ⚡ Забронювати майданчик у кілька кліків тут →
//             <span className="book-now">Забронювати</span>
//           </button>
          
//           <button 
//             className="show-on-map-button"
//             onClick={() => onShowOnMap([court.location.latitude, court.location.longitude])}
//           >
//             Показати на карті
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default React.memo(CourtCard);