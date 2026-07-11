import api from './api';

export const getOverview = () =>
  api.get('/api/analytics/overview').then((r) => r.data.data);

export const getTelemetryAnalytics = (params) =>
  api.get('/api/analytics/telemetry', { params }).then((r) => r.data.data);

export const getAlertAnalytics = () =>
  api.get('/api/analytics/alerts').then((r) => r.data.data);

export const getEmergencyAnalytics = () =>
  api.get('/api/analytics/emergencies').then((r) => r.data.data);
