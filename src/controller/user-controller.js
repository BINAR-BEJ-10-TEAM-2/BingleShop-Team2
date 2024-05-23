const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Verification } = require('../models');
const { ResponseError } = require('../error/response-error');
const { sendVerificationEmail } = require('../libs/email');

const { JWT_SECRET_KEY } = process.env;

// Register
const register = async (req, res, next) => {
  try {
    const {
      fullName, email, password, phone_number, is_admin, is_verified,
    } = req.body;

    const userExist = await User.findOne({
      where: {
        email,
      },
    });

    if (userExist) {
      throw new ResponseError(400, 'EMAIL_ALREADY_EXIST');
    }

    const user = await User.create({
      fullName,
      email,
      password: bcrypt.hashSync(password, 10),
      phone_number,
      is_admin,
      is_verified,
    });

    const generateToken = jwt.sign({ id: user.id }, JWT_SECRET_KEY, { expiresIn: '30m' }, { algorithm: 'HS256' });

    if (user) {
      const setToken = await Verification.create({ user_id: user.id, token: generateToken });

      if (setToken) {
        await sendVerificationEmail(user, setToken.token, next);
      } else {
        throw new ResponseError(400, 'TOKEN_NOT_GENERATED');
      }

      return res.json({
        message: 'USER_CREATED',
        data: {
          fullname: user.fullName,
          email: user.email,
          password: user.password,
          phone_number: user.phone_number,
        },
      });
    }
    throw new ResponseError(400, 'USER_NOT_CREATED');
  } catch (error) {
    next(error);
  }
};

// Verify Email
const verifyEmail = async (req, res, next) => {
  try {
    const verificationToken = req.query.token;
    const userTokenExist = await Verification.findOne({ where: { token: verificationToken }, include: ['user'] });

    if (!userTokenExist) {
      throw new ResponseError(401, 'YOUR_VERIFICATION_LINK_MIGHT_EXPIRED_PLEASE_CLICK_ON_RESEND_FOR_VERIFY_YOUR_EMAIL');
    }
    if (userTokenExist.user.is_verified) {
      await Verification.destroy({ where: { token: verificationToken } });
      return res.status(200).json({ message: 'YOUR_EMAIL_HAS_BEEN_ALREADY_VERIFIED, PLEASE_LOGIN_TO_CONINUE' });
    }

    // set user is_verified to true;
    userTokenExist.user.is_verified = true;
    await userTokenExist.user.save();
    return res.status(200).json({ message: 'YOUR_EMAIL_HAS_BEEN_VERIFIED' });
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
        expiresIn: '30d',
      },
      { algorithm: 'HS256' },
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
      where: { id: currentUser.id },
      returning: true,
    });

    return res.status(200).json({
      message: 'USER_PROFILE_UPDATED',
      data: dataUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  myProfile,
  updateProfile,
  verifyEmail,
};
