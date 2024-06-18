import React, { useEffect, useRef } from 'react';

const Map = ({ onMapLoad, markers }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = () => {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          zoom: 13,
          center: { lat: 52.5200, lng: 13.4050 }
        });
        onMapLoad(mapInstanceRef.current);
      };
      document.head.appendChild(script);
    };
    loadGoogleMapsScript();
  }, [onMapLoad]);

  useEffect(() => {
    if (mapInstanceRef.current && markers.length > 0) {
      markers.forEach(({ googleCoords, hereCoords, name }) => { // Assuming each marker object has a name property
        if (googleCoords) {
          new window.google.maps.Marker({
            position: googleCoords,
            map: mapInstanceRef.current,
            title: name // Use the name property for the Google Maps marker title
          });
        }
        if (hereCoords) {
          new window.google.maps.Marker({
            position: hereCoords,
            map: mapInstanceRef.current,
            title: name, // Use the name property for the HereWeGo marker title
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Different icon for HereWeGo markers
          });
        }
      });
    }
  }, [markers]);

  return <div id="map" ref={mapRef} style={{ height: '500px', width: '100%' }}></div>;
};

export default Map;