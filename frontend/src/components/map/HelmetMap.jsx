import { memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { formatTime } from '../../utils/formatDate';
import { Map } from 'lucide-react';

import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function HelmetMap({ helmets }) {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (!helmets || helmets.length === 0) return;

    const valid = helmets.filter(
      (h) =>
        h.currentTelemetry &&
        h.currentTelemetry.latitude != null &&
        h.currentTelemetry.longitude != null
    );

    setMarkers(
      valid.map((h) => ({
        id: h.helmetId,
        name: h.minerName || h.helmetId,
        lat: h.currentTelemetry.latitude,
        lng: h.currentTelemetry.longitude,
        heartRate: h.currentTelemetry.heartRate,
        status: h.deviceStatus,
        time: h.currentTelemetry.timestamp,
      }))
    );
  }, [helmets]);

  if (markers.length === 0) {
    return (
      <div className="map-placeholder">
        <div className="map-placeholder__icon">
          <Map size={22} />
        </div>
        <p>No GPS data available</p>
        <p style={{ fontSize: 'var(--text-xs)' }}>Positions appear here when helmets transmit coordinates.</p>
      </div>
    );
  }

  const center = markers.length > 0 ? [markers[0].lat, markers[0].lng] : [20.5937, 78.9629];

  return (
    <div className="map-wrapper">
      <div className="map-wrapper__header">
        <span className="map-wrapper__title">GPS Positions ({markers.length})</span>
      </div>
      <div className="map-container">
        <MapContainer center={center} zoom={15} className="helmet-map" scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((m) => (
            <Marker key={m.id} position={[m.lat, m.lng]}>
              <Popup>
                <div className="map-popup">
                  <strong>{m.name}</strong>
                  <span>ID: {m.id}</span>
                  <span>HR: {m.heartRate ?? '—'} bpm</span>
                  <span>Status: {m.status}</span>
                  <span>Updated: {formatTime(m.time)}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default memo(HelmetMap);
