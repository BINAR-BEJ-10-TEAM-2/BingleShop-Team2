const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Item } = require('../../src/models');

const createTestUser = async () => {
  await User.create({
    fullName: 'Test User',
    email: 'user@test.com',
    password: bcrypt.hashSync('password', 10),
    phone_number: '123456789',
    is_admin: 'false',
    is_verified: 'true',
    accessToken: 'Bearer testToken',
  });
};

const getTestUser = async () => await User.findOne({
  where: {
    email: 'user@test.com',
  },
});

const createTestItem = async () => {
  await Item.create({
    item_name: 'Test Item Sunlight',
    price: 10000,
    stock: 10,
    description: 'Test deskripsi Item Sunlight',
    image_url: 'https://cloudinary.com/sunlight-test.jpg',
  });
};

const getTestItem = async () => await Item.findOne({
  where: {
    item_name: 'Test Item Sunlight',
  },
});

const generateToken = async () => {
  const testUser = await getTestUser();
  return jwt.sign({ id: testUser.id, isAdmin: false }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

module.exports = {
  createTestUser,
  createTestItem,
  getTestUser,
  getTestItem,
  generateToken,
};
