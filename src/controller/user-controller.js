const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ResponseError } = require('../error/response-error');

const { JWT_SECRET_KEY } = process.env;

// Register
const register = async (req, res, next) => {
  try {
    const {
      fullName, email, password, phone_number, is_admin,
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

//myProfile
const myProfile = (req, res) => {
  const currentUser = req.user;

  //console.log(currentUser.id);

  return res.json({
    fullName: currentUser.fullName,
    email: currentUser.email,
    phone_number: currentUser.phone_number,
  });
};

const updateProfile = async (req, res, next) => {
  const currentUser = req.user;

  try {  
    const {
      fullName, email, phone_number,
    } = req.body;

    const dataUser = await User.update({
      fullName,
      email,
      phone_number,
    }, {
      where: {id: currentUser.id},
      returning: true,
    });
  
  return res.status(200).json({
    message: 'USER_PROFILE_UPDATED',
    data: dataUser 
  })
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  myProfile,
  updateProfile,
};
