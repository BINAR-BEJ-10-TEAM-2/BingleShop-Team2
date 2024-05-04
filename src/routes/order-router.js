const orderRouter = require('express').Router();
const orderController = require('../controller/order-controller');

orderRouter.post('/:userId/create-order', orderController.createOrder);
orderRouter.get('/:orderId', orderController.getOrder);
orderRouter.put('/:orderId/completed', orderController.putOrder);

// Admin
orderRouter.get('/admin/order-list', orderController.getListOrder);

module.exports = orderRouter;
