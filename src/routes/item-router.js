const itemRouter = require('express').Router();
const itemController = require('../controller/item-controller');
const { uploadItemImage } = require('../libs/multer');
const { isAdmin, validateRequest } = require('../middlewares');

itemRouter.post('/admin/add-item', isAdmin, uploadItemImage, validateRequest.itemCreate, itemController.createItem);
itemRouter.get('/list', itemController.getItem);
itemRouter.put('/admin/update-item/:itemId', isAdmin, uploadItemImage, validateRequest.itemUpdate, itemController.updateItem);
itemRouter.get('/specified-item/:itemId', itemController.getItemById);
itemRouter.delete('/admin/delete-item/:itemId', isAdmin, itemController.deleteItemById);

module.exports = itemRouter;
