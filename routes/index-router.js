const routerIndex = require('express').Router();
const userRouter = require('../routes/user-router');
const itemRouter = require('../routes/item-router');
const orderRouter = require('../routes/order-router');

routerIndex.use('/api/users', userRouter);
routerIndex.use('/api/items', itemRouter);
routerIndex.use('/api/orders', orderRouter);

module.exports = routerIndex;
