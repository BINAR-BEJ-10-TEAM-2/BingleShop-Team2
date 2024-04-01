const itemController = require('../controller/item-controller');
const itemRouter = require('express').Router();

itemRouter.post('/', itemController.createItem);

module.exports = itemRouter;
