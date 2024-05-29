const userRouter = require('express').Router();
const userController = require('../controller/user-controller');
const { isAuthenticated, validateRequest } = require('../middlewares');

userRouter.post('/register', validateRequest.userRegister, userController.register);
userRouter.post('/login', validateRequest.userLogin, userController.login);
userRouter.get('/verify-email/activation', userController.verifyEmail);
userRouter.get('/my-profile', isAuthenticated, userController.myProfile);
userRouter.put('/update-profile', isAuthenticated, validateRequest.userProfile, userController.updateProfile);

module.exports = userRouter;
