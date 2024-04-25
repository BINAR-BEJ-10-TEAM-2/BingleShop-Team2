const { Item } = require('../models');
const { ResponseError } = require('../error/response-error');

const createItem = async (req, res) => {
  try {
    const { item_name, price, stock, image_url, description } = req.body;
    const item = new Item({
      item_name,
      price,
      stock,
      image_url,
      description,
    });
    const result = await item.save();

    return res.status(201).json({
      message: 'ITEM_CREATED',
      data: { result },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getItem = async (req, res) => {
  try {
    const items = await Item.findAll();

    return res.status(200).json({
      length: items.length,
      data: { items },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const itemFound = await Item.findByPk(itemId);

    if (!itemFound) {
      throw new ResponseError(404, 'ITEM_NOT_FOUND');
    }

    const dataItem = await Item.update(req.body, {
      where: { id: itemId },
      returning: true,
    });

    return res.status(200).json({
      message: 'ITEM_UPDATED',
      data: { dataItem },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { createItem, getItem, updateItem };
