const itemRouter = require('express').Router();
const itemController = require('../controller/item-controller');
const { is_admin } = require('../middlewares');


itemRouter.post('/admin/add-item', is_admin, itemController.createItem);
itemRouter.get('/list', itemController.getItem);
itemRouter.put('/admin/update-item/:itemId', is_admin, itemController.updateItem);
itemRouter.get('/admin/specified-item/:itemId', is_admin, itemController.getItemById);
itemRouter.delete('/admin/delete-item/:itemId', is_admin, itemController.deleteItemById);

module.exports = itemRouter;
