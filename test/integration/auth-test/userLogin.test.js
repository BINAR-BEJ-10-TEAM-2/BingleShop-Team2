require('assert').strictEqual(process.env.NODE_ENV, 'test');
const supertest = require('supertest')
const { describe, it, expect, beforeEach } = require('@jest/globals');
const { sequelize } = require('../../../src/models');
const app = require('../../../app');
const { createTestUser, getTestUser }= require('../../helpers/user-utils');


describe('POST /api/users/login', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
        await createTestUser()
    });

    it('should login successfully', async () => {
        const response = await supertest(app)
            .post('/api/users/login')
            .send({
                 email: 'user@test.com', 
                 password: 'password'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
    
    });


    it('should fail login with invalid email or invalid password', async () => {
        const response = await supertest(app)
            .post('/api/users/login')
            .send({
                 email: 'wrong@example.com',
                 password: 'password123' 
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'INVALID_CREDENTIALS_EMAIL_OR_PASSWORD_NOT_VALID');
    });

});

