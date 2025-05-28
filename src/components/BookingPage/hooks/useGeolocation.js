import { useState, useEffect } from 'react';
import { cities } from '../../../components/constants/cities';

const useGeolocation = (courts) => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(cities[0].coordinates);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [position.coords.latitude, position.coords.longitude];
          setUserLocation(location);
          setMapCenter(location);
        },
        (error) => {
          console.error("Error getting user location:", error);
          if (courts.length > 0) {
            setMapCenter([courts[0].location.latitude, courts[0].location.longitude]);
          }
        }
      );
    } else if (courts.length > 0) {
      setMapCenter([courts[0].location.latitude, courts[0].location.longitude]);
    }
  }, [courts]);

  const handleShowOnMap = (coordinates) => {
    setMapCenter(coordinates);
  };

  return {
    userLocation,
    mapCenter,
    handleShowOnMap
  };
};

export default useGeolocation;