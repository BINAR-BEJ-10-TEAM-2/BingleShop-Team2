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
const {
  createTestItem,
} = require('../../helpers/item-utils');
const { createTestOrder, getTestOrder } = require('../../helpers/order-utils');
const database = require('../../helpers/database');


describe('GET /api/orders/admin/order-list', () => {
  beforeEach(async () => {
    await database.cleanup();
    await createTestItem();
    await createTestOrder();
  });

  it('should get all data of order by userId', async () => {
    const token = await createTestUserAdmin();
    const orderTestData = await getTestOrder();

    const response = await supertest(app)
      .get('/api/orders/admin/order-list')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.user_id).toBe(orderTestData.user_id);
    expect(response.body.data.order_id).toBe(orderTestData.order_id);
    expect(response.body.data.address_to).toBe(orderTestData.address_to);
    expect(response.body.data.total_order_price).toBe(orderTestData.total_order_price);
    expect(response.body.data.status).toBe(orderTestData.status);
  });
});
