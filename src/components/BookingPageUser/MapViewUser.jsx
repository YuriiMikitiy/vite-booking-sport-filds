import React, { useEffect , useRef} from "react";
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

const highlightedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const SafeMarker = ({ position, children, highlighted }) => {
  const markerRef = useRef();

  useEffect(() => {
    const marker = markerRef.current;
    if (marker && highlighted) {
      marker.setIcon(highlightedIcon);
    } else if (marker && !highlighted) {
      marker.setIcon(L.Icon.Default.prototype);
    }
  }, [highlighted]);

  return position ? (
    <Marker position={position} ref={markerRef}>
      {children}
    </Marker>
  ) : null;
};

export default function MapViewUser({
  mapCenter,
  userLocation,
  bookings,
  highlightedMarker,
  mapRef,
}) {
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
    >
      <ChangeView center={mapCenter} zoom={13} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {userLocation && (
        <SafeMarker position={[userLocation.lat, userLocation.lng]}>
          <Popup>Ваше поточне місцезнаходження</Popup>
        </SafeMarker>
      )}
      {bookings.map((booking) => (
        <SafeMarker
          key={booking.id}
          position={[
            booking.sportsField.location.latitude,
            booking.sportsField.location.longitude,
          ]}
          highlighted={highlightedMarker === booking.id}
        >
          <Popup>
            <b>{booking.sportsField.title}</b>
            <br />
            {new Date(booking.startTime).toLocaleDateString()}{" "}
            {new Date(booking.startTime).toLocaleTimeString()} -{" "}
            {new Date(booking.endTime).toLocaleTimeString()}
          </Popup>
        </SafeMarker>
      ))}
    </MapContainer>
  );
}