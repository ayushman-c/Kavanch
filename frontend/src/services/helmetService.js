import api from './api';

export const getAllHelmets = () =>
  api.get('/api/helmets').then((r) => r.data.data);

export const getHelmetById = (helmetId) =>
  api.get(`/api/helmets/${helmetId}`).then((r) => r.data.data);

export const registerHelmet = (data) =>
  api.post('/api/helmets', data).then((r) => r.data.data);

export const updateHelmet = (helmetId, data) =>
  api.put(`/api/helmets/${helmetId}`, data).then((r) => r.data.data);
