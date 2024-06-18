import React, { useEffect, useRef } from 'react';

const Map = ({ onMapLoad }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      script.addEventListener('load', () => {
        onMapLoad(new window.google.maps.Map(mapRef.current, {
          zoom: 13,
          center: { lat: 52.5200, lng: 13.4050 }
        }));
      });
    };
    loadGoogleMapsScript();
  }, [onMapLoad]);

  return <div id="map" ref={mapRef} style={{ height: '500px', width: '100%' }}></div>;
};

export default Map;

