import { memo } from 'react';
import { Activity, HardHat, Bell, TriangleAlert } from 'lucide-react';

const cards = [
  { label: 'Total Helmets', key: 'totalHelmets', icon: HardHat },
  { label: 'Online', key: 'onlineHelmets', icon: HardHat },
  { label: 'Offline', key: 'offlineHelmets', icon: HardHat },
  { label: 'Total Alerts', key: 'totalAlerts', icon: Bell },
  { label: 'Active Alerts', key: 'activeAlerts', icon: Bell },
  { label: 'Resolved Alerts', key: 'resolvedAlerts', icon: Bell },
  { label: 'Total Emergencies', key: 'totalEmergencies', icon: TriangleAlert },
  { label: 'Active Emergencies', key: 'activeEmergencies', icon: TriangleAlert },
  { label: 'Telemetry Packets', key: 'telemetryPackets', icon: Activity },
];

const avgCards = [
  { label: 'Avg Battery', key: 'averageBatteryLevel', unit: '%' },
  { label: 'Avg Heart Rate', key: 'averageHeartRate', unit: 'bpm' },
  { label: 'Avg SpO₂', key: 'averageSpO2', unit: '%' },
  { label: 'Avg Temperature', key: 'averageBodyTemperature', unit: '°C' },
  { label: 'Avg Gas Level', key: 'averageGasLevel', unit: 'ppm' },
];

function AnalyticsOverview({ overview }) {
  if (!overview) return null;

  return (
    <div className="analytics-overview">
      <div className="analytics-overview__grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.key} className="metric-card">
              <div className="metric-card__icon">
                <Icon size={18} />
              </div>
              <div className="metric-card__info">
                <div className="metric-card__value">
                  {overview[card.key] != null ? overview[card.key] : '—'}
                </div>
                <div className="metric-card__label">{card.label}</div>
              </div>
            </div>
          );
        })}
      </div>
      <h3 className="section-title" style={{ marginTop: 24 }}>Averages</h3>
      <div className="analytics-overview__grid" style={{ marginTop: 12 }}>
        {avgCards.map((card) => (
          <div key={card.key} className="metric-card">
            <div className="metric-card__icon">
              <Activity size={18} />
            </div>
            <div className="metric-card__info">
              <div className="metric-card__value">
                {overview[card.key] != null ? `${overview[card.key]}${card.unit || ''}` : '—'}
              </div>
              <div className="metric-card__label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(AnalyticsOverview);
