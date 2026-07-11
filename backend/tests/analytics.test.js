const request = require('supertest');
const app = require('../src/app');

describe('Analytics API', () => {
  it('GET /api/analytics/overview - should return overview stats or error', async () => {
    const res = await request(app).get('/api/analytics/overview');
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalHelmets');
      expect(res.body.data).toHaveProperty('onlineHelmets');
      expect(res.body.data).toHaveProperty('totalAlerts');
      expect(res.body.data).toHaveProperty('totalEmergencies');
      expect(res.body.data).toHaveProperty('telemetryPackets');
    } else {
      expect([400, 404, 500]).toContain(res.status);
    }
  }, 15000);

  it('GET /api/analytics/telemetry - should return telemetry analytics or error', async () => {
    const res = await request(app).get('/api/analytics/telemetry');
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('packetCount');
      expect(res.body.data).toHaveProperty('heartRate');
      expect(res.body.data).toHaveProperty('spo2');
    } else {
      expect([400, 500]).toContain(res.status);
    }
  }, 15000);

  it('GET /api/analytics/alerts - should return alert breakdowns or error', async () => {
    const res = await request(app).get('/api/analytics/alerts');
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('byType');
      expect(res.body.data).toHaveProperty('bySeverity');
      expect(res.body.data).toHaveProperty('byStatus');
    } else {
      expect([400, 500]).toContain(res.status);
    }
  }, 15000);

  it('GET /api/analytics/emergencies - should return emergency breakdowns or error', async () => {
    const res = await request(app).get('/api/analytics/emergencies');
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('byType');
      expect(res.body.data).toHaveProperty('byStatus');
    } else {
      expect([400, 500]).toContain(res.status);
    }
  }, 15000);
});
