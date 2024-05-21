require('assert').strictEqual(process.env.NODE_ENV, 'test');
const supertest = require('supertest');
const {
  describe, it, expect, beforeEach,
} = require('@jest/globals');
const app = require('../../../app');
const {
  createTestUser,
} = require('../../helpers/user-utils');
const {
  // createTestItem,
  createTestManyItems,
} = require('../../helpers/item-utils');
const database = require('../../helpers/database');

describe('GET /api/items/list', () => {
  beforeEach(async () => {
    await database.cleanup();
    await createTestManyItems();
  });

  it('should get all item', async () => {
    const token = await createTestUser();

    const response = await supertest(app)
      .get('/api/items/list')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('should return an error when the user is Unauthorized', async () => {
    const response = await supertest(app)
      .get('/api/items/list');

    // console.log(response.text)
    expect(response.status).toBe(401);
    expect(response.text).toBe('Unauthorized');
  });
});
