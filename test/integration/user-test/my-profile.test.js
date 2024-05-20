require('assert').strictEqual(process.env.NODE_ENV, 'test');
const supertest = require('supertest')
const { describe, it, expect, beforeEach } = require('@jest/globals');
const { sequelize } = require('../../../src/models');
const app = require('../../../app');
const { createTestUser, getTestUser } = require('../../helpers/user-utils');

describe('GET /api/users/my-profile', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await createTestUser();
  });

  it('should return the user profile for authenticated user', async () => {
    const token = await createTestUser()
    const testUser = await getTestUser()
    const response = await supertest(app)
      .get('/api/users/my-profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.fullname).toBe(testUser.fullname);
    expect(response.body.email).toBe(testUser.email)
    expect(response.body.phone_number).toBe(testUser.phone_number)

  });
  
})
