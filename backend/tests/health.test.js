const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  it('should return server status or 500 without DB', async () => {
    const res = await request(app).get('/health');
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.data.server).toBe('running');
      expect(res.body.data).toHaveProperty('database');
      expect(res.body.data).toHaveProperty('environment');
      expect(res.body.data).toHaveProperty('uptime');
      expect(res.body.data).toHaveProperty('version');
      expect(res.body.data).toHaveProperty('pid');
      expect(res.body.data).toHaveProperty('nodeVersion');
      expect(res.body.data).toHaveProperty('memory');
      expect(res.body.data).toHaveProperty('activeHelmets');
      expect(res.body.data).toHaveProperty('totalHelmets');
      expect(res.body.data).toHaveProperty('timestamp');
    }
  }, 10000);
});

describe('404 handling', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
