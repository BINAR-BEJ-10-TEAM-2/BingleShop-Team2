require('assert').strictEqual(process.env.NODE_ENV, 'test');
const supertest = require('supertest');
const {
  describe, it, expect, beforeEach,
} = require('@jest/globals');
const bcrypt = require('bcrypt');
const { sequelize } = require('../../../src/models');
const app = require('../../../app');
const { createTestUser, getTestUser } = require('../../helpers/user-utils');

describe('POST /api/users/register', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await createTestUser();
  });

  it('should register a new user successfully', async () => {
    const response = await supertest(app)
      .post('/api/users/register')
      .send({
        email: 'test@example.com',
        password: bcrypt.hashSync('password', 10),
        is_admin: false,
        fullName: 'Poltak Raja Minyak',
        phone_number: '081234567890',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('USER_CREATED');
  });

  it('should fail to register if email is already in use', async () => {
    // Create a test user with a known email
    const existingUser = await getTestUser();
    const response = await supertest(app)
      .post('/api/users/register')
      .send({
        email: existingUser.email,
        fullName: 'Test User',
        password: bcrypt.hashSync('password', 10),
        phone_number: '123456789909',
        is_admin: false,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('EMAIL_ALREADY_EXIST');
  });
});
