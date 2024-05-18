require('assert').strictEqual(process.env.NODE_ENV, 'test');
const supertest = require('supertest');
const {
  describe, it, expect, beforeEach,
} = require('@jest/globals');
const { sequelize } = require('../../../src/models');
const app = require('../../../app');
const {
  createTestUserAdmin,
} = require('../../helpers/user-utils');

describe('POST /api/items/admin/add-item', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await createTestUserAdmin();
  });

  it('should get all item', async () => {
    const token = await createTestUserAdmin();

    const response = await supertest(app)
      .get('/api/items/list')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
