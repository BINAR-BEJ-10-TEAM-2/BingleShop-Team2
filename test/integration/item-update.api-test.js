const supertest = require('supertest');
const database = require('../helpers/database');
const {
    describe, it, expect, beforeEach,
  } = require('@jest/globals');
const app = require('../../app');
const {
    createTestUser, createTestItem, getTestUser,
    getTestItem,
    getTestItemById,
    generateToken,
} = require('../helpers/test-utils');

describe('POST /api/items/update-item/:itemId', () => {
    let token;
    beforeAll(async () => {
        await database.cleanup()
        await createTestUser();
        await createTestItem();

        // Generate JWT token
        token = await generateToken(getTestUser);
    })

    it('should update data item', async () => {
        const itemId = 1;
        const itemFound = await getTestItemById(itemId);
        console.log(itemFound);
        const response = await supertest(app)
        .put(`/api/items/admin/update-item/${itemId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            item_name:'Test Item MamaLemon',
            price: 8000,
            stock: itemFound.stock,
            description: 'Test deskripsi Item MamaLemon'
        });

        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('ITEM_UPDATED');
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.item_name).toBe('Test Item MamaLemon')
        expect(response.body.data.price).toBe('8000')
        expect(response.body.data.stock).toBe(itemFound.stock)
        expect(response.body.data.description).toBe('Test deskripsi Item MamaLemon')
    });
});