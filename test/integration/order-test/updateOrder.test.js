require('assert').strictEqual(process.env.NODE_ENV, 'test');
const supertest = require('supertest');
const {
  describe, it, expect, beforeEach,
} = require('@jest/globals');
const { send } = require('process');
const { Order } = require('../../../src/models');
const app = require('../../../app');
const {
  createTestUser, getTestUser,
} = require('../../helpers/user-utils');
const {
  createTestItem,
} = require('../../helpers/item-utils');
const { createTestOrder, putTestOrder } = require('../../helpers/order-utils');
const database = require('../../helpers/database');

describe('PUT /api/orders/:orderId/completed', () => {
  beforeEach(async () => {
    await database.cleanup();
    await createTestItem();
    await createTestOrder();
    // await putTestOrder();
  });

  it('should update an order', async () => {
    const token = await createTestUser();
    const testUser = await getTestUser();
    const orderTestData = await putTestOrder();

    const response = await supertest(app)
      .put(`/api/orders/${orderTestData.id}/completed`)
      // .put(`/api/orders/${await putTestOrder().id}/completed`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        order: {
          user_id: testUser.id,
          status: 'completed',
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('ORDER_UPDATED');

    const updatedOrder = await Order.findByPk(orderTestData.id);
    // const updatedOrder = await Order.findByPk(await putTestOrder().id);
    expect(updatedOrder.status).toBe('completed');
  });

  it('should return an error when the order is not found', async () => {
    const token = await createTestUser();
    const testUser = await getTestUser();
    // const orderTestData = await putTestOrder();

    const response = await supertest(app)
      .put('/api/orders/999999/completed')
      .set('Authorization', `Bearer ${token}`)
      .send({
        order: {
          user_id: testUser.id,
          status: 'completed',
        },
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('ORDER_NOT_FOUND');
  });
});
