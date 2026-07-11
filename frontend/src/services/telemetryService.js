import api from './api';

export const getLatestTelemetry = (helmetId) =>
  api.get(`/api/telemetry/latest/${helmetId}`).then((r) => r.data.data);

export const getTelemetryHistory = (helmetId, params) =>
  api.get(`/api/telemetry/history/${helmetId}`, { params }).then((r) => r.data.data);
