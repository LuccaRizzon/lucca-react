import React from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

const MapWithMarkers = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: '',
  });

  const data = [
    { id: 1, placa: 'ABC1234', nome: 'João Maria', lat: -22.51012, lng: -46.633308 },
    { id: 2, placa: 'BCA5342', nome: 'Joselito Nunes', lat: -22.531506, lng: -46.634507 },
    { id: 3, placa: 'CBA8754', nome: 'Pedro Santos', lat: -22.522527, lng: -46.632206 },
  ];

  const [selectedMarker, setSelectedMarker] = React.useState(null);

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  const mapCenter = {
    lat: data.reduce((sum, item) => sum + item.lat, 0) / data.length,
    lng: data.reduce((sum, item) => sum + item.lng, 0) / data.length,
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <GoogleMap
        center={mapCenter}
        zoom={15}
        mapContainerStyle={{
          width: '100%',
          height: '100%',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        {data.map((item) => (
          <Marker
            key={item.id}
            position={{ lat: item.lat, lng: item.lng }}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            onClick={() => setSelectedMarker(item)}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div style={{ padding: '10px', fontSize: '14px', maxWidth: '200px' }}>
              <h5 style={{ margin: '0 0 5px', color: '#333' }}>Vehicle Info</h5>
              <p style={{ margin: '0' }}>
                <strong>Placa:</strong> {selectedMarker.placa}
              </p>
              <p style={{ margin: '0' }}>
                <strong>Nome:</strong> {selectedMarker.nome}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h3 style={{ margin: '0', fontSize: '18px', color: '#555' }}>Map Overview</h3>
        <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#777' }}>
          Click on markers to see details.
        </p>
      </div>
    </div>
  );
};

export default MapWithMarkers;
