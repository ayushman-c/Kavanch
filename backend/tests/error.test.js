const request = require('supertest');
const app = require('../src/app');

describe('Error Handling', () => {
  it('should return JSON for all errors', async () => {
    const res = await request(app)
      .get('/api/helmets/INVALID')
      .set('Accept', 'application/json');
    expect([404, 500]).toContain(res.status);
    expect(res.headers['content-type']).toMatch(/json/);
  }, 10000);

  it('should return structured error response for validation', async () => {
    const res = await request(app).post('/api/helmets').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message');
  });

  it('should handle malformed JSON gracefully', async () => {
    const res = await request(app)
      .post('/api/helmets')
      .set('Content-Type', 'application/json')
      .send('not json');
    expect(res.status).toBe(400);
  });
});
