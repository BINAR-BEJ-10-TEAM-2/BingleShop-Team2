const orderController = require('../controller/order-controller');
const orderRouter = require('express').Router();

orderRouter.post('/', orderController.createOrder);
orderRouter.put('/:id', orderController.putOrder);

module.exports = orderRouter;
