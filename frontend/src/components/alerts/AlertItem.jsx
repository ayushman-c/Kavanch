import { memo } from 'react';
import { formatDateTime } from '../../utils/formatDate';

function AlertItem({ alert }) {
  return (
    <div className={`alert-item alert-item--${alert.severity || 'info'}`}>
      <div className="alert-item__header">
        <span className="alert-item__type">{alert.type || 'Alert'}</span>
        <span className={`badge badge--${alert.severity === 'critical' ? 'critical' : alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'info'}`}>
          {alert.severity || 'info'}
        </span>
      </div>
      <p className="alert-item__message">{alert.message || '—'}</p>
      <div className="alert-item__footer">
        <div className="alert-item__meta">
          <span className="alert-item__helmet">{alert.helmetId}</span>
          <span>{formatDateTime(alert.timestamp)}</span>
        </div>
        <span className={`badge badge--${alert.status === 'active' ? 'online' : 'resolved'}`}>
          {alert.status}
        </span>
      </div>
    </div>
  );
}

export default memo(AlertItem);
