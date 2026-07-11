const request = require('supertest');
const app = require('../src/app');

describe('Helmet API Validation', () => {
  it('POST /api/helmets - should reject empty body', async () => {
    const res = await request(app)
      .post('/api/helmets')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/helmets - should reject non-string helmetId', async () => {
    const res = await request(app)
      .post('/api/helmets')
      .send({ helmetId: 123 });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/helmets - should return array or 500 without DB', async () => {
    const res = await request(app).get('/api/helmets');
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    } else {
      expect(res.status).toBe(500);
    }
  }, 10000);

  it('GET /api/helmets/:helmetId - should return 404 or 500 without DB', async () => {
    const res = await request(app).get('/api/helmets/UNKNOWN-99');
    expect([404, 500]).toContain(res.status);
    expect(res.body.success).toBe(false);
  }, 10000);
});
