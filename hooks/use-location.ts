import { useState, useEffect } from 'react';

interface Location {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

const useLocation = () => {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, error: 'Geolocation is not supported by this browser.' }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => {
        setLocation((prev) => ({ ...prev, error: `Error getting location: ${error.message}` }));
      }
    );
  }, []);

  return location;
};

export default useLocation;