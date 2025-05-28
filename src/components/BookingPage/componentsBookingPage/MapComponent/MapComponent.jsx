import React, {useRef, useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';   //maybe problem
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

// Fix for default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const MapComponent = ({ center, userLocation, courts }) => {
  const mapRef = useRef();

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="map-container"
      whenCreated={(map) => { mapRef.current = map }}
      key={`${center[0]}-${center[1]}`}
    >
      <ChangeView center={center} zoom={13} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {userLocation && (
        <Marker position={userLocation}>
          <Popup>Ваше поточне місцезнаходження</Popup>
        </Marker>
      )}
      
      {courts.map((court) => (
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
};

export default React.memo(MapComponent);