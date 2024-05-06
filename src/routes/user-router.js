const userRouter = require('express').Router();
const userController = require('../controller/user-controller');
const { isAuthenticated } = require('../middlewares');

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.get('/myProfile', isAuthenticated, userController.myProfile);

module.exports = userRouter;
