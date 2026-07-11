import { memo } from 'react';
import { formatDateTime } from '../../utils/formatDate';

function EmergencyCard({ emergency }) {
  const isActive = emergency.status === 'active';

  return (
    <div className={`emergency-card${isActive ? ' emergency-card--active' : ''}`}>
      <div className="emergency-card__header">
        <span className="emergency-card__type">{emergency.emergencyType || 'Unknown'}</span>
        <span className={`status-badge status-badge--${isActive ? 'error' : 'offline'}`}>
          {emergency.status}
        </span>
      </div>
      <div className="emergency-card__body">
        <span className="emergency-card__helmet">{emergency.helmetId}</span>
      </div>
      <div className="emergency-card__footer">
        <span>
          Started: {formatDateTime(emergency.startedAt)}
        </span>
        {emergency.resolvedAt && (
          <span>
            Resolved: {formatDateTime(emergency.resolvedAt)}
          </span>
        )}
      </div>
    </div>
  );
}

export default memo(EmergencyCard);
