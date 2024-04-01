const routerIndex = require('express').Router();
const userRouter = require('../routes/user-router');
const itemRouter = require('../routes/item-router');

routerIndex.use('/api/users', userRouter);
routerIndex.use('/api/items', itemRouter);

module.exports = routerIndex;
