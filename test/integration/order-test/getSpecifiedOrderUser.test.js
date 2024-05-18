require('assert').strictEqual(process.env.NODE_ENV, 'test');
const supertest = require('supertest');
const {
  describe, it, expect, beforeEach,
} = require('@jest/globals');
const { sequelize } = require('../../../src/models');
const app = require('../../../app');
const {
  createTestUser,
} = require('../../helpers/user-utils');
const {
  createTestItem,
} = require('../../helpers/item-utils');
const { createTestOrder, getTestSpecifiedOrder } = require('../../helpers/order-utils');

describe('GET /api/orders/order-list/:orderId', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await createTestItem();
    await createTestOrder();
  });

  it('should get specified data of order by userId', async () => {
    const token = await createTestUser();
    const orderTestData = await getTestSpecifiedOrder();

    const response = await supertest(app)
      .get(`/api/orders/order-list/${orderTestData.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data[0].id).toBe(orderTestData.id);
    expect(response.body.data[0].user_id).toBe(orderTestData.user_id);
  });
});
