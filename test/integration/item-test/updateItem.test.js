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
  updateItemDummy,
} = require('../../helpers/item-utils');
const database = require('../../helpers/database');

describe('PUT /api/items/admin/update-item/:itemId', () => {
  beforeEach(async () => {
    await database.cleanup();
    await createTestItem();
  });

  it('should update specified item by id', async () => {
    const token = await createTestUserAdmin();

    const result = await supertest(app)
      .put('/api/items/admin/update-item/1')
      .set('Authorization', `Bearer ${token}`)
      .send(updateItemDummy);

    expect(result.status).toBe(200);
    expect(result.body.message).toBe('ITEM_UPDATED');
  });

  it('should return an error when item is not found', async () => {
    const token = await createTestUserAdmin();

    const result = await supertest(app)
      .put('/api/items/admin/update-item/3')
      .set('Authorization', `Bearer ${token}`)
      .send(updateItemDummy);

    expect(result.status).toBe(404);
    expect(result.body.message).toBe('ITEM_NOT_FOUND');
  });
});
