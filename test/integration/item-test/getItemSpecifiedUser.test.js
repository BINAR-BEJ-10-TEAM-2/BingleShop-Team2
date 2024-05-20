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
  createTestItem,
} = require('../../helpers/item-utils');
const database = require('../../helpers/database');

describe('POST /api/items/admin/specified-item/:itemId', () => {
  beforeEach(async () => {
    await database.cleanup();
    await createTestItem();
  });

  it('should get specified item by id', async () => {
    const token = await createTestUserAdmin();

    const response = await supertest(app)
      .get('/api/items/admin/specified-item/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
