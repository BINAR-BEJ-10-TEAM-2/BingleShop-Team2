const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ResponseError } = require('../error/response-error');

const { JWT_SECRET_KEY } = process.env;

// Register
const register = async (req, res, next) => {
  try {
    const { nickname, email, password, phone_number, is_admin } = req.body;

    const userExist = await User.findOne({
      where: {
        email,
      },
    });

    if (userExist) {
      throw new ResponseError(400, 'EMAIL_ALREADY_EXIST');
    }

    const user = new User({
      fullName,
      email,
      password: bcrypt.hashSync(password, 10),
      phone_number,
      is_admin,
    });

    await user.save();

    return res.json({
      message: 'USER_CREATED',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Login
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

    const jwtPayload = jwt.sign(
      {
        id: userExist.id,
        email: userExist.email,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: '1h',
      },
    );

    return res.json({
      message: 'LOGIN_SUCCESS',
      accessToken: jwtPayload,
    });
  } catch (error) {
    next(error);
  }
};


//whoami 
const whoami = (req, res) => {
  const currentUser = req.user;

  return res.json({
    id: currentUser.id,
    email: currentUser.email,
  });
};

module.exports = {
  register,
  login,
  whoami,
};
