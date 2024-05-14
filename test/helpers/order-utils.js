const { Order } = require('../../src/models');

const createTestOrder = async () => {
  await Order.create({

  });
};

module.exports = { createTestOrder };
