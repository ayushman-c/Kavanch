const request = require('supertest');
const app = require('../src/app');

describe('Telemetry API Validation', () => {
  it('POST /api/telemetry - should reject missing helmetId', async () => {
    const res = await request(app)
      .post('/api/telemetry')
      .send({ heartRate: 80 });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/telemetry - should reject empty body', async () => {
    const res = await request(app)
      .post('/api/telemetry')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/telemetry - unknown helmet returns 404 or 500', async () => {
    const res = await request(app)
      .post('/api/telemetry')
      .send({ helmetId: 'NONEXIST-99', heartRate: 80 });
    expect([404, 500]).toContain(res.status);
    expect(res.body.success).toBe(false);
  }, 15000);

  it('GET /api/telemetry/latest/:helmetId - unknown helmet returns 404 or 500', async () => {
    const res = await request(app).get('/api/telemetry/latest/NONEXIST-99');
    expect([404, 500]).toContain(res.status);
    expect(res.body.success).toBe(false);
  }, 15000);
});
