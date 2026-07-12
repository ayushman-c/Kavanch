import { memo } from 'react';
import { Signal, Wifi, MapPin } from 'lucide-react';

function SignalBar({ value, label, rssi, unit }) {
  const clamped = Math.max(0, Math.min(100, value ?? 0));
  const filled = Math.round(clamped / 10);

  return (
    <div className="signal-row">
      <span className="signal-row__label">{label}</span>
      <div className="signal-bar">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className={`signal-bar__seg${i < filled ? ' signal-bar__seg--on' : ''}`} />
        ))}
      </div>
      <span className="signal-row__pct">{clamped}%</span>
      {rssi != null && <span className="signal-row__rssi">{rssi} dBm</span>}
    </div>
  );
}

function SignalPanel({ helmets }) {
  const items = (helmets || []).filter((h) => h.currentTelemetry);
  if (items.length === 0) return null;

  return (
    <div className="signal-panel">
      <div className="signal-panel__header">
        <span className="signal-panel__title">Signal &amp; Network</span>
      </div>
      <div className="signal-panel__list">
        {items.map((h) => {
          const t = h.currentTelemetry;
          return (
            <div key={h.helmetId} className="signal-card">
              <div className="signal-card__head">
                <span className="signal-card__name">
                  <Signal size={14} />
                  {h.minerName || t.worker || h.helmetId}
                </span>
                <span className="signal-card__id">{h.helmetId}</span>
              </div>

              <SignalBar
                label="Gateway"
                value={t.gatewaySignal}
                rssi={t.gatewayRSSI}
              />
              <SignalBar
                label="Relay"
                value={t.relaySignal}
                rssi={t.relayRSSI}
              />

              <div className="signal-card__metrics">
                <div className="signal-card__metric">
                  <MapPin size={12} />
                  <span>GW Dist: {t.gatewayDistance != null ? `${t.gatewayDistance.toFixed(1)} m` : '—'}</span>
                </div>
                <div className="signal-card__metric">
                  <MapPin size={12} />
                  <span>RL Dist: {t.relayDistance != null ? `${t.relayDistance.toFixed(1)} m` : '—'}</span>
                </div>
              </div>

              <div className="signal-card__footer">
                <span>Packet #{t.packetNumber ?? '—'}</span>
                <span>Latency: {t.latency != null ? `${t.latency} ms` : '—'}</span>
                <span>Loss: {t.packetLoss != null ? t.packetLoss : '—'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(SignalPanel);
