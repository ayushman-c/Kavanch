import { memo } from 'react';
import { formatDateTime } from '../../utils/formatDate';

function EmergencyItem({ emergency }) {
  const isActive = emergency.status === 'active';

  return (
    <div className={`emergency-item${isActive ? ' emergency-item--active' : ''}`}>
      <div className="emergency-item__header">
        <span className="emergency-item__type">{emergency.emergencyType || 'Emergency'}</span>
        <span className={`badge badge--${isActive ? 'error' : 'resolved'}`}>
          {emergency.status}
        </span>
      </div>
      <div className="emergency-item__body">
        <span className="emergency-item__helmet">{emergency.helmetId}</span>
      </div>
      <div className="emergency-item__footer">
        <span>Started: {formatDateTime(emergency.startedAt)}</span>
        {emergency.resolvedAt && <span>Resolved: {formatDateTime(emergency.resolvedAt)}</span>}
      </div>
    </div>
  );
}

export default memo(EmergencyItem);
