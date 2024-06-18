import React, { useState } from 'react';
import './main.css';
import SearchBar from './components/SearchBar';
import AddressComponents from './components/AddressComponents';
import NearbyPlaces from './components/NearbyPlaces';
import Map from './components/Map';

const App = () => {
  const [place, setPlace] = useState(null);
  const [places, setPlaces] = useState([]);
  const [map, setMap] = useState(null);

  const onSearch = (location, type) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ 'address': location }, (results, status) => {
      if (status === 'OK') {
        const loc = results[0].geometry.location;
        map.setCenter(loc);
        findNearbyPlaces(loc, type);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  const findNearbyPlaces = (location, type) => {
    const request = {
      location,
      radius: 3000,
      type: type ? [type] : []
    };
    const service = new window.google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        displayNearbyPlaces(results);
      } else {
        alert('Places service returned status: ' + status);
      }
    });
  };

  const displayNearbyPlaces = (places) => {
    setPlaces(places.map(place => ({
      name: `${place.name} - ${place.vicinity}`,
      googleCoords: `Lat: ${place.geometry.location.lat()}, Lng: ${place.geometry.location.lng()}`,
      hereCoords: 'Fetching...',
      hereName: 'Fetching...',
      distance: 'Calculating...'
    })));
  };

  return (
    <div className="container flex">
      <SearchBar onSearch={onSearch} />
      <AddressComponents place={place} />
      <NearbyPlaces places={places} />
      <Map onMapLoad={setMap} />
    </div>
  );
};

export default App;
