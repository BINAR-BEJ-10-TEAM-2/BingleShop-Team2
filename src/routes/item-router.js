const itemRouter = require('express').Router();
const itemController = require('../controller/item-controller');

itemRouter.post('/', itemController.createItem);
itemRouter.get('/', itemController.getItem);
itemRouter.put('/:itemId', itemController.updateItem);

module.exports = itemRouter;
