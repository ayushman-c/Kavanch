export const formatStatus = (status) => {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const formatSeverity = (severity) => {
  if (!severity) return '—';
  return severity.charAt(0).toUpperCase() + severity.slice(1);
};
