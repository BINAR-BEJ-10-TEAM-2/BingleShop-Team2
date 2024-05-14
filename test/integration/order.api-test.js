require('assert').strictEqual(process.env.NODE_ENV, 'test');
const supertest = require('supertest');
const {
  describe, it, expect, beforeEach,
} = require('@jest/globals');
const { sequelize } = require('../../src/models');
const app = require('../../app');
const {
  createTestUser, createTestItem, getTestUser,
  getTestItem,
  generateToken,
} = require('../helpers/test-utils');

describe('POST /api/orders/:userId/create-order', () => {
  let token;
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await createTestUser();
    await createTestItem();
    // Generate JWT token
    token = await generateToken(getTestUser);
  });

  it('should create a new order', async () => {
    const testUser = await getTestUser();
    const testItem = await getTestItem();
    const response = await supertest(app)
      .post(`/api/orders/${testUser.id}/create-order`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        order: {
          user_id: testUser.id,
          address_to: 'Jl. Gatot Subroto',
          total_order_price: 20000,
        },
        items: [
          {
            id: testItem.id,
            quantity: 2,
          },
        ],
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('ORDER_CREATED');
  });

  // it('should return an error when the item stock is not enough', () => {

  // });

  // it('should return an error when the item is not found', () => {

  // });

  // it('should return an error when the user is not an admin', () => {

  // })
});
