const userController = require('../controller/user-controller');

const userRouter = require('express').Router();

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);

module.exports = userRouter;
