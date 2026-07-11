import api from './api';

export const getEmergencies = (params) =>
  api.get('/api/dashboard/emergencies', { params }).then((r) => r.data.data);
