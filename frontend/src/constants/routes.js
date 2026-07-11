export const ROUTES = {
  DASHBOARD: '/',
  ALERTS: '/alerts',
  EMERGENCIES: '/emergencies',
  HELMET_DETAIL: '/helmet/:helmetId',
  ANALYTICS: '/analytics',
};

export const buildHelmetPath = (helmetId) => `/helmet/${helmetId}`;
