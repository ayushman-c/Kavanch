import { memo } from 'react';
import { Activity } from 'lucide-react';

function LiveTelemetry({ telemetry }) {
  const items = telemetry || [];

  return (
    <div className="telemetry-panel">
      <div className="telemetry-panel__header">
        <span className="telemetry-panel__title">Live Telemetry</span>
        <span className="telemetry-panel__live-badge">
          <span className="telemetry-panel__live-dot" />
          REAL-TIME
        </span>
      </div>
      <div className="telemetry-panel__list">
        {items.length === 0 ? (
          <div className="empty-state" style={{ border: 'none', padding: '32px 16px' }}>
            <div className="empty-state__icon">
              <Activity size={20} />
            </div>
            <h3 className="empty-state__title">No telemetry data</h3>
            <p className="empty-state__message">
              Telemetry updates will appear here in real-time when helmets start transmitting.
            </p>
          </div>
        ) : (
          items.map((entry, i) => (
            <div key={entry._id || i} className="telemetry-item">
              <div className="telemetry-item__header">
                <span className="telemetry-item__helmet">{entry.helmetId}</span>
                <span className="telemetry-item__time">
                  {entry.timestamp
                    ? new Date(entry.timestamp).toLocaleTimeString('en-IN')
                    : '—'}
                </span>
              </div>
              <div className="telemetry-item__grid">
                <div className="telemetry-item__field">
                  <span className="telemetry-item__label">HR</span>
                  <span className="telemetry-item__value">{entry.heartRate ?? '—'}</span>
                </div>
                <div className="telemetry-item__field">
                  <span className="telemetry-item__label">SpO₂</span>
                  <span className="telemetry-item__value">{entry.spo2 ?? '—'}%</span>
                </div>
                <div className="telemetry-item__field">
                  <span className="telemetry-item__label">Temp</span>
                  <span className="telemetry-item__value">{entry.bodyTemperature ?? '—'}°C</span>
                </div>
                <div className="telemetry-item__field">
                  <span className="telemetry-item__label">Gas</span>
                  <span className="telemetry-item__value">{entry.gasLevel ?? '—'}ppm</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default memo(LiveTelemetry);
