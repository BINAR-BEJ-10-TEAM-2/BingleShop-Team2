require('assert').strictEqual(process.env.NODE_ENV, 'test');
const supertest = require('supertest');
const {
  describe, it, expect, beforeEach,
} = require('@jest/globals');
const app = require('../../../app');
const {
  createTestUserAdmin,
} = require('../../helpers/user-utils');
const {
  // createTestItem,
  createTestManyItems,
} = require('../../helpers/item-utils');
const database = require('../../helpers/database');

describe('POST /api/items/admin/add-item', () => {
  beforeEach(async () => {
    await database.cleanup();
    await createTestManyItems();
  });

  it('should get all item', async () => {
    const token = await createTestUserAdmin();

    const response = await supertest(app)
      .get('/api/items/list')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
