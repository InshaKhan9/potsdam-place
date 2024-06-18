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
  const [markers, setMarkers] = useState([]);

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

  const fetchHereWeGoData = async (placeName) => {
    const hereApiKey = process.env.REACT_APP_HERE_API_KEY;
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(placeName)}&apiKey=${hereApiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const { lat, lng } = data.items[0].position;
        return {
          hereCoords: { lat, lng },
          hereName: data.items[0].address.label,
          distance: 'Calculating...' // Implement distance calculation as needed
        };
      } else {
        return {
          hereCoords: null,
          hereName: 'No data',
          distance: 'No data'
        };
      }
    } catch (error) {
      console.error('Error fetching HereWeGo data:', error);
      return {
        hereCoords: null,
        hereName: 'Error fetching',
        distance: 'Error'
      };
    }
  };

  const displayNearbyPlaces = async (places) => {
    const placesWithHereData = await Promise.all(places.map(async (place) => {
      const placeName = `${place.name}, ${place.vicinity}`;
      const hereData = await fetchHereWeGoData(placeName);
      return {
        name: placeName,
        googleCoords: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() },
        ...hereData
      };
    }));

    setPlaces(placesWithHereData);
    setMarkers(placesWithHereData.map(place => ({
      googleCoords: place.googleCoords,
      hereCoords: place.hereCoords,
      name: place.name
    })));
  };

  return (
    <div className="container flex">
      <SearchBar onSearch={onSearch} />
      <AddressComponents place={place} />
      <NearbyPlaces places={places} />
      <Map onMapLoad={setMap} markers={markers} />
    </div>
  );
};

export default App;
