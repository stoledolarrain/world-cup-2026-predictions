import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Solución oficial para que los marcadores por defecto de Leaflet se vean bien en Vite/React
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Arreglo de sedes oficiales del Mundial 2026 (Puedes agregar el resto de la lista)
const stadiums = [
  { id: 1, name: "Estadio Azteca", city: "Ciudad de México, MX", lat: 19.3029, lng: -99.1505 },
  { id: 2, name: "Estadio Akron", city: "Guadalajara, MX", lat: 20.6816, lng: -103.4626 },
  { id: 3, name: "MetLife Stadium", city: "Nueva York/Nueva Jersey, US", lat: 40.8128, lng: -74.0742 },
  { id: 4, name: "SoFi Stadium", city: "Los Ángeles, US", lat: 33.9534, lng: -118.3387 },
  { id: 5, name: "BMO Field", city: "Toronto, CA", lat: 43.6332, lng: -79.4186 },
  { id: 6, name: "Hard Rock Stadium", city: "Miami, US", lat: 25.9580, lng: -80.2389 }
];

const StadiumMap = () => {
  return (
    <div className="w-full overflow-hidden bg-gray-200 border border-gray-300 rounded-lg shadow-sm h-96">
      <MapContainer 
        center={[39.8283, -98.5795]} // Coordenadas para centrar la cámara en Norteamérica
        zoom={3} 
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {stadiums.map((stadium) => (
          <Marker key={stadium.id} position={[stadium.lat, stadium.lng]}>
            <Popup>
              <div className="text-center">
                <strong className="block text-blue-800">{stadium.name}</strong>
                <span className="text-sm text-gray-600">{stadium.city}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default StadiumMap;