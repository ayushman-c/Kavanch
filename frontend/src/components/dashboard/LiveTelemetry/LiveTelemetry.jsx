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
                  <span className="telemetry-item__label">Humidity</span>
                  <span className="telemetry-item__value">{entry.humidity ?? '—'}%</span>
                </div>
                <div className="telemetry-item__field">
                  <span className="telemetry-item__label">Temp</span>
                  <span className="telemetry-item__value">{entry.bodyTemperature ?? '—'}°C</span>
                </div>
                <div className="telemetry-item__field">
                  <span className="telemetry-item__label">LPG</span>
                  <span className="telemetry-item__value">{entry.mq6 ?? '—'}</span>
                </div>
                <div className="telemetry-item__field">
                  <span className="telemetry-item__label">CH₄</span>
                  <span className="telemetry-item__value">{entry.mq4 ?? '—'}</span>
                </div>
                <div className="telemetry-item__field">
                  <span className="telemetry-item__label">H₂</span>
                  <span className="telemetry-item__value">{entry.mq8 ?? '—'}</span>
                </div>
                <div className="telemetry-item__field">
                  <span className="telemetry-item__label">SOS</span>
                  <span className="telemetry-item__value" style={{ color: entry.sos ? 'var(--danger)' : 'var(--text-muted)' }}>
                    {entry.sos ? 'ACTIVE' : '—'}
                  </span>
                </div>
                <div className="telemetry-item__field">
                  <span className="telemetry-item__label">GW RSSI</span>
                  <span className="telemetry-item__value">{entry.gatewayRSSI ?? '—'}</span>
                </div>
                <div className="telemetry-item__field">
                  <span className="telemetry-item__label">RL RSSI</span>
                  <span className="telemetry-item__value">{entry.relayRSSI ?? '—'}</span>
                </div>
                <div className="telemetry-item__field">
                  <span className="telemetry-item__label">GW Dist</span>
                  <span className="telemetry-item__value">{entry.gatewayDistance != null ? `${entry.gatewayDistance.toFixed(1)}m` : '—'}</span>
                </div>
                <div className="telemetry-item__field">
                  <span className="telemetry-item__label">RL Dist</span>
                  <span className="telemetry-item__value">{entry.relayDistance != null ? `${entry.relayDistance.toFixed(1)}m` : '—'}</span>
                </div>
                <div className="telemetry-item__field">
                  <span className="telemetry-item__label">Latency</span>
                  <span className="telemetry-item__value">{entry.latency != null ? `${entry.latency}ms` : '—'}</span>
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
