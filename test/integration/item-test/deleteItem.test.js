require('assert').strictEqual(process.env.NODE_ENV, 'test');
const supertest = require('supertest');
const {
  describe, it, expect, beforeEach,
} = require('@jest/globals');
const app = require('../../../app');
const {
  createTestUserAdmin,
} = require('../../helpers/user-utils');
const {
    createTestItem,
    createTestItem2,
  } = require('../../helpers/item-utils');
const database = require('../../helpers/database');

describe('DELETE /api/items/admin/delete-item/:itemId', () => {
    beforeEach(async () => {
        await database.cleanup();
        await createTestUserAdmin();
        await createTestItem();
        await createTestItem2();
    })

    it('should delete specified item by id', async () => {
        const token = await createTestUserAdmin();

        const result = await supertest(app)
        .delete('/api/items/admin/delete-item/1')
        .set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(200);
        expect(result.body.message).toBe('ITEM_DELETED');
    });

    it('should return an error when item is not found', async () => {
        const token = await createTestUserAdmin();

        const result = await supertest(app)
        .delete('/api/items/admin/delete-item/4')
        .set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(404);
        expect(result.body.message).toBe('ITEM_NOT_FOUND');
    });
    
});