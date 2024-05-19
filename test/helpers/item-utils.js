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

const updateItemDummy = {
    item_name: 'Test Item MamaLemon',
    price: 8000,
    stock: 8,
    description: 'Test deskripsi Item MamaLemon',
    image_url: 'https://cloudinary.com/mamalemon-test.jpg',
}

module.exports = {
  createTestItem,
  getTestItem,
  updateItemDummy,
};
