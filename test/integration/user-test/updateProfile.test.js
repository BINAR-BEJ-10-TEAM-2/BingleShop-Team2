require('assert').strictEqual(process.env.NODE_ENV, 'test');
const supertest = require('supertest');
const {
  describe, it, expect, beforeEach,
} = require('@jest/globals');
const app = require('../../../app');
const {
  createTestUser,
  updateProfileDummy,
} = require('../../helpers/user-utils');
const database = require('../../helpers/database');

describe('PUT /api/users/update-profile', () => {
    beforeEach(async () => {
        await database.cleanup();
        await createTestUser();
    })

    it('should update user profile ', async () => {
        const token = await createTestUser();

        const result = await supertest(app)
        .put('/api/users/update-profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateProfileDummy);

        const resBody = result.body.data[1][0]

        expect(result.status).toBe(200);
        expect(result.body.message).toBe('USER_PROFILE_UPDATED');
        // to check if result.body.data is equal to body.request
        for (let i =0; i < resBody.length; i++ ){
            return expect(resBody[i]).toBe(updateProfileDummy[i]);
        }
    });
    
});