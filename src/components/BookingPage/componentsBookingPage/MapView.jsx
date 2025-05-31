import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapView({
  mapCenter,
  userLocation,
  sportFild,
  mapRef,
  setMapCenter,
  setUserLocation,
  selectedCity,
}) {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
          if (sportFild.length > 0) {
            setMapCenter([sportFild[0].location.latitude, sportFild[0].location.longitude]);
          } else {
            setMapCenter(selectedCity.coordinates);
          }
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      if (sportFild.length > 0) {
        setMapCenter([sportFild[0].location.latitude, sportFild[0].location.longitude]);
      }
    }
  }, [sportFild, selectedCity, setMapCenter, setUserLocation]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{
        height: "550px",
        width: "500px",
        marginLeft: "42px",
        borderRadius: "15px",
        marginTop: "24px",
      }}
      whenCreated={(map) => {
        mapRef.current = map;
      }}
      key={`${mapCenter[0]}-${mapCenter[1]}`}
    >
      <ChangeView center={mapCenter} zoom={13} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {userLocation && (
        <Marker position={userLocation}>
          <Popup>Ваше поточне місцезнаходження</Popup>
        </Marker>
      )}
      {sportFild.map((court) => (
        <Marker
          position={[court.location.latitude, court.location.longitude]}
          key={court.id}
        >
          <Popup>
            <b>{court.title}</b>
            <br />
            {court.location.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}