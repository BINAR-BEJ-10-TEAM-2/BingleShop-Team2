const path = require('path');
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
  // const filePath = ${__dirname}/uploads/image.png
  const filePath = path.resolve(__dirname, '../../../uploads/image.png');
  // console.log(filePath)

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await createTestUserAdmin();
    // Generate JWT token
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
});