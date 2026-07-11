import { memo } from 'react';
import { Search, Filter } from 'lucide-react';

function HelmetTable({ helmets, onHelmetClick }) {
  const rows = helmets || [];

  return (
    <div className="table-wrapper">
      <div className="table-header">
        <div className="table-header__left">
          <span className="table-header__title">Helmet Status</span>
          <span className="table-header__count">{rows.length} helmet{rows.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="table-header__right">
          <div className="table-search">
            <Search className="table-search__icon" size={14} />
            <input className="table-search__input" type="search" placeholder="Search..." aria-label="Search helmets" />
          </div>
          <button className="table-btn" type="button">
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>Helmet ID</th>
              <th>Worker</th>
              <th>Gas Level</th>
              <th>Heart Rate</th>
              <th>Temperature</th>
              <th>Battery</th>
              <th>Status</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="table__empty">No helmets registered yet</td>
              </tr>
            ) : (
              rows.map((helmet) => (
                <tr
                  key={helmet.helmetId}
                  className="table__row-clickable"
                  onClick={() => onHelmetClick?.(helmet.helmetId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onHelmetClick?.(helmet.helmetId)}
                >
                  <td className="table__cell-mono" style={{ fontWeight: 600 }}>{helmet.helmetId || '—'}</td>
                  <td>{helmet.minerName || '—'}</td>
                  <td className="table__cell-mono">{helmet.currentTelemetry?.gasLevel ?? '—'}</td>
                  <td className="table__cell-mono">{helmet.currentTelemetry?.heartRate ?? '—'}</td>
                  <td className="table__cell-mono">{helmet.currentTelemetry?.bodyTemperature ?? '—'}°C</td>
                  <td className="table__cell-mono">
                    <span style={{ color: (helmet.batteryLevel ?? 100) <= 10 ? 'var(--danger)' : undefined }}>
                      {helmet.batteryLevel != null ? `${helmet.batteryLevel}%` : '—'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge--${helmet.deviceStatus || 'offline'}`}>
                      {helmet.deviceStatus || 'offline'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                    {helmet.lastSeen ? new Date(helmet.lastSeen).toLocaleString('en-IN') : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(HelmetTable);
