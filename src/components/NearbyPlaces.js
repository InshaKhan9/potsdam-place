import React from 'react';

const NearbyPlaces = ({ places }) => {
  if (!places.length) return null;

  return (
    <div>
      <h1>Nearby Places</h1>
      <table>
        <thead>
          <tr>
            <th>Place Name</th>
            <th>HERE WeGo Place Name</th>
            <th>Google Coordinates</th>
            <th>HERE WeGo Coordinates</th>
            <th>Coordinate Difference (km)</th>
          </tr>
        </thead>
        <tbody>
          {places.map((place, index) => (
            <tr key={index}>
              <td>{place.name}</td>
              <td>{place.hereName}</td>
              <td>{place.googleCoords}</td>
              <td>{place.hereCoords}</td>
              <td>{place.distance}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={downloadCSV}>Download CSV</button>
    </div>
  );

  function downloadCSV() {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Place Name,Google Coordinates,HERE WeGo Place Name,HERE WeGo Coordinates,Coordinate Difference (km)\n" +
      places.map(place => `"${place.name}","${place.googleCoords}","${place.hereName}","${place.hereCoords}","${place.distance}"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "places.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default NearbyPlaces;
