const orderRouter = require('express').Router();
const orderController = require('../controller/order-controller');
const { isAdmin } = require('../middlewares');

orderRouter.post('/create-order', orderController.createOrder);
orderRouter.get('/order-list', orderController.getUserOrder);
orderRouter.get('/order-list/:orderId', orderController.getSpecifiedUserOrder);
orderRouter.put('/:orderId/completed', orderController.updateOrder);

// Admin
orderRouter.get('/admin/order-list', isAdmin, orderController.getListOrder);

module.exports = orderRouter;
