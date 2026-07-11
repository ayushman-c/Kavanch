import { memo } from 'react';
import { formatDateTime, formatRelativeTime } from '../../utils/formatDate';
import { formatBattery } from '../../utils/formatBattery';
import { formatStatus } from '../../utils/formatStatus';

function HelmetInfo({ helmet }) {
  if (!helmet) return null;

  return (
    <div className="helmet-info">
      <div className="helmet-info__header">
        <h2 className="helmet-info__id">{helmet.helmetId}</h2>
        <span className={`badge badge--${helmet.deviceStatus || 'offline'}`}>
          {helmet.deviceStatus || 'offline'}
        </span>
      </div>
      <div className="helmet-info__grid">
        <div className="helmet-info__item">
          <span className="helmet-info__label">Worker</span>
          <span className="helmet-info__value">{helmet.minerName || '—'}</span>
        </div>
        <div className="helmet-info__item">
          <span className="helmet-info__label">Battery</span>
          <span className="helmet-info__value">{formatBattery(helmet.batteryLevel)}</span>
        </div>
        <div className="helmet-info__item">
          <span className="helmet-info__label">Last Seen</span>
          <span className="helmet-info__value">{formatDateTime(helmet.lastSeen)}</span>
        </div>
        <div className="helmet-info__item">
          <span className="helmet-info__label">Last Seen (Relative)</span>
          <span className="helmet-info__value">{formatRelativeTime(helmet.lastSeen)}</span>
        </div>
        <div className="helmet-info__item">
          <span className="helmet-info__label">Firmware</span>
          <span className="helmet-info__value">{helmet.firmwareVersion || '—'}</span>
        </div>
        <div className="helmet-info__item">
          <span className="helmet-info__label">Connection</span>
          <span className="helmet-info__value">{formatStatus(helmet.deviceStatus)}</span>
        </div>
      </div>
    </div>
  );
}

export default memo(HelmetInfo);
