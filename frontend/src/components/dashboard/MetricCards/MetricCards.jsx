import { memo } from 'react';
import { HardHat, Bell, TriangleAlert, Activity } from 'lucide-react';

const cardDefs = [
  { label: 'Workers Online', key: 'onlineHelmets', icon: HardHat },
  { label: 'Helmets Connected', key: 'totalHelmets', icon: HardHat },
  { label: 'Active Alerts', key: 'activeAlerts', icon: Bell, color: 'var(--warning)' },
  { label: 'Emergencies', key: 'activeEmergencies', icon: TriangleAlert, color: 'var(--danger)' },
];

const avgDefs = [
  { label: 'Avg Air Quality', key: 'averageGasLevel', unit: 'ppm' },
  { label: 'Avg Heart Rate', key: 'averageHeartRate', unit: 'bpm' },
  { label: 'Battery Health', key: 'averageBatteryLevel', unit: '%' },
];

function MetricCards({ summary }) {
  if (!summary) return null;

  return (
    <div className="metrics-grid">
      {cardDefs.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.key} className="metric-card">
            <div className="metric-card__icon">
              <Icon size={18} />
            </div>
            <div className="metric-card__info">
              <div className={`metric-card__value${card.color ? '' : ''}`}>
                {summary[card.key] != null ? summary[card.key] : '—'}
              </div>
              <div className="metric-card__label">{card.label}</div>
            </div>
          </div>
        );
      })}
      {avgDefs.map((card) => (
        <div key={card.key} className="metric-card">
          <div className="metric-card__icon">
            <Activity size={18} />
          </div>
          <div className="metric-card__info">
            <div className="metric-card__value">
              {summary[card.key] != null ? `${summary[card.key]}${card.unit ? card.unit : ''}` : '—'}
            </div>
            <div className="metric-card__label">{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(MetricCards);
