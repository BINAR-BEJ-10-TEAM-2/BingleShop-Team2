const itemRouter = require('express').Router();
const itemController = require('../controller/item-controller');
const {upload} = require('../libs/multer');

itemRouter.post('/admin/add-item', upload.single('item_image'), itemController.createItem);
itemRouter.get('/', itemController.getItem);
itemRouter.put('/:itemId', itemController.updateItem);

module.exports = itemRouter;
