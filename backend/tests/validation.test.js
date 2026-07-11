const request = require('supertest');
const app = require('../src/app');

describe('Validation Error Handling', () => {
  it('POST /api/helmets - invalid helmetId type', async () => {
    const res = await request(app)
      .post('/api/helmets')
      .send({ helmetId: true });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('PUT /api/helmets/KAVACH-01 - empty body', async () => {
    const res = await request(app)
      .put('/api/helmets/KAVACH-01')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('PUT /api/helmets/KAVACH-01 - invalid field', async () => {
    const res = await request(app)
      .put('/api/helmets/KAVACH-01')
      .send({ invalidField: 'test' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('PUT /api/helmets/KAVACH-01 - invalid deviceStatus', async () => {
    const res = await request(app)
      .put('/api/helmets/KAVACH-01')
      .send({ deviceStatus: 'nonexistent' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
