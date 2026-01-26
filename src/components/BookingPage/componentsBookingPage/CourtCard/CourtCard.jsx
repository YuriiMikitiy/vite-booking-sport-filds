import React from "react";
import { getCorrectType } from "../../BookingPage"; // Assuming getCorrectType is exported from BookingPage

const CourtCard = ({ courts, setSelectedCourt, handleShowOnMap }) => {
  return (
    <div style={{ marginBottom: "50px" }}>
      {courts.map((court) => (
        <div className="card" key={court.id}>
          <div className="card-image-container">
            <img
              src={
                court.imageUrl ||
                "/src/assets/images/default-image-for-sport-field.jpg"
              }
              onError={(e) =>
                (e.target.src =
                  "/src/assets/images/default-image-for-sport-field.png")
              }
              className="card-image"
            />
            <div className="image-badges">
              <span className="badge red">❤️ Без комісії</span>
              <span className="badge yellow">⚡ Онлайн</span>
            </div>
          </div>
          <div className="card-info">
            <h3>{court.title}</h3>
            <p>{court.location?.address ?? "Немає"}</p>

            {/* Відображення всіх видів спорту */}
            <div className="tags">
              {court.types?.map((sportType, index) => (
                <span className="tag" key={index}>
                  <img
                    src={
                      getCorrectType(sportType.type)?.icon ||
                      "/src/assets/images/default-sport.png"
                    }
                    alt={getCorrectType(sportType.type)?.name || "Спорт"}
                    width="20"
                  />{" "}
                  {getCorrectType(sportType.type)?.name || "Спорт"}
                </span>
              ))}
            </div>
            {court.warningInformation && (
              <p className="warning">⚠️{court.warningInformation}</p>
            )}
            <p className="description">
              У цьому клубі можна забронювати корт менше ніж за 1 хвилину
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                className="book-button highlight"
                onClick={() => {
                  setSelectedCourt(court);
                  //setSelectedSportType(selectedSport.name);
                }}
              >
                ⚡ Забронювати майданчик у кілька кліків тут →{" "}
                <div
                  style={{
                    backgroundColor: "Blue",
                    padding: "8px",
                    borderRadius: "15px",
                    margin: "0px",
                  }}
                >
                  Забронювати
                </div>
              </button>
              <button
                className="show-on-map-button"
                onClick={() =>
                  handleShowOnMap([
                    court.location.latitude,
                    court.location.longitude,
                  ])
                }
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
