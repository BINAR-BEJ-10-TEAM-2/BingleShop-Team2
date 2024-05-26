const userRouter = require('express').Router();
const userController = require('../controller/user-controller');
const { isAuthenticated, v } = require('../middlewares');

userRouter.post('/register', v.validateRegister ,userController.register);
userRouter.post('/login', v.validateLogin ,userController.login);
userRouter.get('/verify-email/activation', userController.verifyEmail);
userRouter.get('/my-profile', isAuthenticated, userController.myProfile);
userRouter.put('/update-profile', v.validateProfile ,isAuthenticated, userController.updateProfile);

module.exports = userRouter;
