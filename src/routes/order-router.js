const orderRouter = require('express').Router();
const orderController = require('../controller/order-controller');

orderRouter.post('/', orderController.createOrder);
orderRouter.put('/:id', orderController.putOrder);

module.exports = orderRouter;
