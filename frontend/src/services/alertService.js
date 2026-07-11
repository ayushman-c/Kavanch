import api from './api';

export const getAlerts = (params) =>
  api.get('/api/dashboard/alerts', { params }).then((r) => r.data.data);
