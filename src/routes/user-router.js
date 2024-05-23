const userRouter = require('express').Router();
const userController = require('../controller/user-controller');
const { isAuthenticated } = require('../middlewares');

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.get('/verify-email/activation', userController.verifyEmail);
userRouter.get('/my-profile', isAuthenticated, userController.myProfile);
userRouter.put('/update-profile', isAuthenticated, userController.updateProfile);

module.exports = userRouter;
