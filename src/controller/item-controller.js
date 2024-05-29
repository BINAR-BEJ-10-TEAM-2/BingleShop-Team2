const { Item } = require('../models');
const { ResponseError } = require('../error/response-error');
const { uploadToCloudinary } = require('../libs/cloudinary');

const createItem = async (req, res, next) => {
  try {
    const {
      item_name, price, stock, description,
    } = req.body;

    const image_url = process.env.NODE_ENV !== 'test' ? await uploadToCloudinary(req.file.buffer) : null;

    const result = await Item.create({
      item_name,
      price,
      stock,
      image_url,
      description,
    });

    return res.status(201).json({
      message: 'ITEM_CREATED',
      data: { result },
    });
  } catch (error) {
    return next(error);
  }
};

const getItem = async (req, res, next) => {
  try {
    const items = await Item.findAll();

    return res.status(200).json({
      length: items.length,
      data: { items },
    });
  } catch (error) {
    return next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const itemFound = await Item.findByPk(itemId);

    if (!itemFound) {
      throw new ResponseError(404, 'ITEM_NOT_FOUND');
    }

    const { image_url: oldImageUrl } = itemFound;
    const newImageUrl = req.file ? (await uploadToCloudinary(req.file.buffer)) : oldImageUrl;

    const {
      item_name, price, stock, description,
    } = req.body;
    const updatedItem = {
      item_name,
      price,
      stock,
      description,
      image_url: newImageUrl,
    };

    await itemFound.update(updatedItem, { returning: true });

    return res.status(200).json({
      message: 'ITEM_UPDATED',
      data: { item: itemFound },
    });
  } catch (error) {
    return next(error);
  }
};

const getItemById = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const itemFound = await Item.findByPk(itemId);
    if (!itemFound) {
      throw new ResponseError(404, 'ITEM_NOT_FOUND');
    }

    return res.status(200).json({
      data: { itemFound },
    });
  } catch (error) {
    return next(error);
  }
};

const deleteItemById = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const itemFound = await Item.findByPk(itemId);
    if (!itemFound) {
      throw new ResponseError(404, 'ITEM_NOT_FOUND');
    }
    await itemFound.destroy();

    return res.status(200).json({
      message: 'ITEM_DELETED',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createItem, getItem, updateItem, getItemById, deleteItemById,
};
