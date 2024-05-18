const {
  Item,
} = require('../../src/models');

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

module.exports = {
  createTestItem,
  getTestItem,
};
