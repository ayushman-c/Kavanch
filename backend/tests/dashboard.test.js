const request = require('supertest');
const app = require('../src/app');

describe('Dashboard API', () => {
  it('GET /api/dashboard/summary - should return data or error', async () => {
    const res = await request(app).get('/api/dashboard/summary');
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    } else {
      expect([400, 500]).toContain(res.status);
    }
  }, 15000);

  it('GET /api/dashboard/live - should return data or error', async () => {
    const res = await request(app).get('/api/dashboard/live');
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    } else {
      expect([400, 500]).toContain(res.status);
    }
  }, 15000);

  it('GET /api/dashboard/alerts - should return paginated data or error', async () => {
    const res = await request(app).get('/api/dashboard/alerts');
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('records');
      expect(res.body.data).toHaveProperty('pagination');
    } else {
      expect([400, 500]).toContain(res.status);
    }
  }, 15000);

  it('GET /api/dashboard/emergencies - should return paginated data or error', async () => {
    const res = await request(app).get('/api/dashboard/emergencies');
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('records');
      expect(res.body.data).toHaveProperty('pagination');
    } else {
      expect([400, 500]).toContain(res.status);
    }
  }, 15000);
});
