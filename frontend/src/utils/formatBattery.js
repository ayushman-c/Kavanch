export const formatBattery = (level) => {
  if (level == null) return '—';
  return `${Math.round(level)}%`;
};

export const getBatteryLevel = (level) => {
  if (level == null) return 'unknown';
  if (level <= 10) return 'critical';
  if (level <= 20) return 'low';
  if (level <= 50) return 'medium';
  return 'high';
};
