require('assert').strictEqual(process.env.NODE_ENV, 'test');
const supertest = require('supertest');
const {
  describe, it, expect, beforeEach,
} = require('@jest/globals');
const { sequelize } = require('../../../src/models');
const app = require('../../../app');
const {
  createTestUser, getTestUser,
  createTestUserAdmin,
} = require('../../helpers/user-utils');
const { createTestItem, getTestItem } = require('../../helpers/item-utils');

describe('POST /api/orders/create-order', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await createTestItem();
  });

  it('should create a new order', async () => {
    const token = await createTestUser();
    const testUser = await getTestUser();
    const testItem = await getTestItem();

    const response = await supertest(app)
      .post('/api/orders/create-order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        order: {
          user_id: testUser.id,
          address_to: 'Jl. Gatot Subroto Bintang Delima Pinokio',
          total_order_price: 20000,
        },
        items: [
          {
            id: testItem.id,
            quantity: 2,
          },
        ],
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('ORDER_CREATED');
  });

  it('should return an error when the item stock is not enough', async () => {
    const token = await createTestUser();
    const testUser = await getTestUser();
    const testItem = await getTestItem();

    const response = await supertest(app)
      .post('/api/orders/create-order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        order: {
          user_id: testUser.id,
          address_to: 'Jl. Gatot Subroto Bintang Delima Pinokio',
          total_order_price: 20000,
        },
        items: [
          {
            id: testItem.id,
            quantity: 2000,
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it('should return an error when the item is not found', async () => {
    const token = await createTestUser();
    const testUser = await getTestUser();
    const testItem = await getTestItem();

    const response = await supertest(app)
      .post('/api/orders/create-order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        order: {
          user_id: testUser.id,
          address_to: 'Jl. Gatot Subroto Bintang Delima Pinokio',
          total_order_price: 20000,
        },
        items: [
          {
            id: testItem.id + 5,
            quantity: 2,
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('ITEM_NOT_FOUND');
  });

  it('should return an error when the user is an admin', async () => {
    const token = await createTestUserAdmin();
    const testUser = await getTestUser();
    const testItem = await getTestItem();

    const response = await supertest(app)
      .post('/api/orders/create-order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        order: {
          user_id: testUser.id,
          address_to: 'Jl. Gatot Subroto Bintang Delima Pinokio',
          total_order_price: 20000,
        },
        items: [
          {
            id: testItem.id,
            quantity: 2,
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('ADMIN_CANT_CREATE_ORDER');
  });
});
