const request = require('supertest');
const app = require('../src/app');

describe('Swagger Documentation', () => {
  it('GET /api/docs - should return Swagger UI HTML', async () => {
    const res = await request(app).get('/api/docs/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('swagger');
  });
});
