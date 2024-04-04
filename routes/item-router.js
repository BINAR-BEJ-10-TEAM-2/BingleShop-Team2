const itemController = require('../controller/item-controller');
const itemRouter = require('express').Router();

itemRouter.post('/', itemController.createItem);
itemRouter.get('/', itemController.getItem);

module.exports = itemRouter;
