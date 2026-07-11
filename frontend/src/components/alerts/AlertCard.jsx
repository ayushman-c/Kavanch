import { memo } from 'react';
import { formatDateTime } from '../../utils/formatDate';

function AlertCard({ alert }) {
  return (
    <div className={`alert-card alert-card--${alert.severity || 'info'}`}>
      <div className="alert-card__header">
        <span className="alert-card__type">{alert.type || 'Unknown'}</span>
        <span className={`status-badge status-badge--${alert.severity || 'info'}`}>
          {alert.severity || 'info'}
        </span>
      </div>
      <p className="alert-card__message">{alert.message || '—'}</p>
      <div className="alert-card__footer">
        <span className="alert-card__helmet">{alert.helmetId}</span>
        <span className="alert-card__time">{formatDateTime(alert.timestamp)}</span>
        <span className={`status-badge status-badge--${alert.status === 'active' ? 'online' : 'offline'}`}>
          {alert.status}
        </span>
      </div>
    </div>
  );
}

export default memo(AlertCard);
