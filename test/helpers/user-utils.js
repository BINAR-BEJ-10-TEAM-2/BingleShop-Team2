const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  User,
} = require('../../src/models');

const createTestUser = async () => {
  const user = await User.create({
    fullName: 'Test User',
    email: 'user@test.com',
    password: bcrypt.hashSync('password', 10),
    phone_number: '123456789',
    is_admin: 'false',
    is_verified: 'true',
  });
  // Genrate token
  const token = jwt.sign({ id: user.id, isAdmin: false }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  return token;
};

const createTestUserAdmin = async () => {
  const user = await User.create({
    fullName: 'Test User Admin',
    email: 'user_admin@test.com',
    password: bcrypt.hashSync('password', 10),
    phone_number: '123456789',
    is_admin: 'true',
    is_verified: 'true',
  });
  // Genrate token
  const token = jwt.sign({ id: user.id, isAdmin: false }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  return token;
};

const getTestUser = async () => await User.findOne();

module.exports = { createTestUser, createTestUserAdmin, getTestUser };
