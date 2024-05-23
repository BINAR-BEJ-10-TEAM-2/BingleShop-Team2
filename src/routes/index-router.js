const routerIndex = require('express').Router();
const userRouter = require('./user-router');
const itemRouter = require('./item-router');
const orderRouter = require('./order-router');
const { isAuthenticated } = require('../middlewares');

routerIndex.get('/healthcheck', (req, res) => {
  res.sendStatus(200);
});
routerIndex.use('/api/users', userRouter);
routerIndex.use('/api/items', isAuthenticated, itemRouter);
routerIndex.use('/api/orders', isAuthenticated, orderRouter);

module.exports = routerIndex;
