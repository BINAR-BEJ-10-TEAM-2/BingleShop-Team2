const routerIndex = require('express').Router();
const userRouter = require('./user-router');
const itemRouter = require('./item-router');
const orderRouter = require('./order-router');

routerIndex.use('/api/users', userRouter);
routerIndex.use('/api/items', itemRouter);
routerIndex.use('/api/orders', orderRouter);

module.exports = routerIndex;
