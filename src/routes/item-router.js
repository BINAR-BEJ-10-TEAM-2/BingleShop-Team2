const itemRouter = require('express').Router();
const itemController = require('../controller/item-controller');
const { isAdmin } = require('../middlewares');


itemRouter.post('/admin/add-item', isAdmin, itemController.createItem);
itemRouter.get('/list', itemController.getItem);
itemRouter.put('/admin/update-item/:itemId', isAdmin, itemController.updateItem);
itemRouter.get('/admin/specified-item/:itemId', isAdmin, itemController.getItemById);
itemRouter.delete('/admin/delete-item/:itemId', isAdmin, itemController.deleteItemById);

module.exports = itemRouter;
