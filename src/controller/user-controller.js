const bcrypt = require('bcrypt');
const { User } = require('../models');
const { ResponseError } = require('../error/response-error');

const register = async (req, res, next) => {
  try {
    const {
      nickname, email, password, phone_number,
    } = req.body;

    const userExist = await User.findOne({
      where: {
        email,
      },
    });

    if (userExist) {
      throw new ResponseError(400, 'EMAIL_ALREADY_EXIST');
    }

    const user = new User({
      nickname,
      email,
      password: bcrypt.hashSync(password, 10),
      phone_number,
    });

    await user.save();

    return res.json({
      message: 'USER_CREATED',
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const userExist = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!userExist) {
      throw new ResponseError(
        401,
        'INVALID_CREDENTIALS_EMAIL_OR_PASSWORD_NOT_VALID',
      );
    }

    const isValidPassword = bcrypt.compareSync(
      req.body.password,
      userExist.password,
    );

    if (!isValidPassword) {
      throw new ResponseError(
        401,
        'INVALID_CREDENTIALS_EMAIL_OR_PASSWORD_NOT_VALID',
      );
    }

    return res.status(200).json({
      message: 'LOGIN_SUCCESS',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
