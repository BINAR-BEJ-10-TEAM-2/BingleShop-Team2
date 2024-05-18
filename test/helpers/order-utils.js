const { Order, OrderItem } = require('../../src/models');
const { getTestItem } = require('./item-utils');

const createTestOrder = async (req, res) => {
  const testItem = await getTestItem();

  if (!testItem) {
    throw new Error('Item not found');
  }

  const newOrder = await Order.create({
    user_id: 1,
    address_to: 'Bandung',
    total_order_price: 20000,
    status: 'pending',
  });
  const orderItem = await OrderItem.create({
    order_id: newOrder.id,
    item_id: testItem.id,
    quantity: 2,
  });

  const order = {
    ...newOrder,
    items: [orderItem],
  };
  return order;
};

const getTestOrder = async () => await Order.findAll();
const getTestSpecifiedOrder = async () => await Order.findOne({ where: { id: 1 } });

module.exports = {
  createTestOrder,
  getTestOrder,
  getTestSpecifiedOrder,
};
