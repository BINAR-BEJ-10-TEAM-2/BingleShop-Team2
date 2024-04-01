const { Item } = require('../models');
const { ResponseError } = require('../error/response-error');
const createItem = async (req, res, next) => {
  try {
    const { product_name, price } = req.body;
    const item = new Item({
      product_name,
      price,
    });
    const result = await item.save();

    return res.json({
      message: 'ITEM_CREATED',
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createItem };
