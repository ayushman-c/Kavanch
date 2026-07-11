import { memo } from 'react';
import { Heart, Thermometer, Wind, Battery, MapPin, Radio } from 'lucide-react';

const sensors = [
  { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', icon: Heart },
  { key: 'spo2', label: 'SpO₂', unit: '%', icon: Wind },
  { key: 'bodyTemperature', label: 'Body Temp', unit: '°C', icon: Thermometer },
  { key: 'gasLevel', label: 'Gas Level', unit: 'ppm', icon: Wind },
  { key: 'batteryLevel', label: 'Battery', unit: '%', icon: Battery },
];

function SensorGrid({ telemetry }) {
  return (
    <div className="sensor-grid">
      {sensors.map((sensor) => {
        const Icon = sensor.icon;
        const value = telemetry?.[sensor.key];
        return (
          <div key={sensor.key} className="sensor-card">
            <div className="sensor-card__icon">
              <Icon size={18} />
            </div>
            <div className="sensor-card__info">
              <span className="sensor-card__value">
                {value != null ? value : '—'}
                <span className="sensor-card__unit"> {sensor.unit}</span>
              </span>
              <span className="sensor-card__label">{sensor.label}</span>
            </div>
          </div>
        );
      })}
      <div className="sensor-card">
        <div className="sensor-card__icon">
          <MapPin size={18} />
        </div>
        <div className="sensor-card__info">
          <span className="sensor-card__value sensor-card__value--small">
            {telemetry?.latitude != null && telemetry?.longitude != null
              ? `${telemetry.latitude.toFixed(4)}, ${telemetry.longitude.toFixed(4)}`
              : '—'}
          </span>
          <span className="sensor-card__label">GPS</span>
        </div>
      </div>
      <div className="sensor-card">
        <div className="sensor-card__icon">
          <Radio size={18} />
        </div>
        <div className="sensor-card__info">
          <span className="sensor-card__value">
            {telemetry?.deviceStatus || telemetry?.helmetId ? 'Active' : '—'}
          </span>
          <span className="sensor-card__label">Device Status</span>
        </div>
      </div>
    </div>
  );
}

export default memo(SensorGrid);
