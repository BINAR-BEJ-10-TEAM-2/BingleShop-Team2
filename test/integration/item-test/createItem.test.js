const path = require('path');
require('assert').strictEqual(process.env.NODE_ENV, 'test');
const supertest = require('supertest');
const {
  describe, it, expect, beforeEach,
} = require('@jest/globals');
const app = require('../../../app');
const {
  createTestUserAdmin,
  createTestUser,
} = require('../../helpers/user-utils');
const database = require('../../helpers/database');

describe('POST /api/items/admin/add-item', () => {
  // const filePath = ${__dirname}/uploads/image.png
  const filePath = path.resolve(__dirname, '../../../uploads/image.png');
  // console.log(filePath)

  beforeEach(async () => {
    await database.cleanup();
  });

  it('should create a new item', async () => {
    const token = await createTestUserAdmin();

    const response = await supertest(app)
      .post('/api/items/admin/add-item')
      .set('Authorization', `Bearer ${token}`)
      .field('item_name', 'Onits')
      .field('price', 10000)
      .field('stock', 3)
      .field('description', 'Lorem Ipsum')
      .attach('item_image', filePath);

    // console.log('Response Body:', response.body);
    expect(response.status).toBe(201);
    expect(response.body.message).toBeDefined();
  });

  it('should return an error when the user is not admin', async () => {
    const token = await createTestUser();
    // const token = await createTestUserAdmin();

    const response = await supertest(app)
      .post('/api/items/admin/add-item')
      .set('Authorization', `Bearer ${token}`)
      .field('item_name', 'Onits')
      .field('price', 10000)
      .field('stock', 3)
      .field('description', 'Lorem Ipsum')
      .attach('item_image', filePath);

    // console.log('Response Body:', response);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden');
  });
});
