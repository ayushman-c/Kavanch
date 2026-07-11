import api from './api';

export const getDashboardSummary = () =>
  api.get('/api/dashboard/summary').then((res) => res.data.data);

export const getDashboardLive = () =>
  api.get('/api/dashboard/live').then((res) => res.data.data);

export const getDashboardAlerts = (params) =>
  api.get('/api/dashboard/alerts', { params }).then((res) => res.data.data);

export const getDashboardEmergencies = (params) =>
  api.get('/api/dashboard/emergencies', { params }).then((res) => res.data.data);
