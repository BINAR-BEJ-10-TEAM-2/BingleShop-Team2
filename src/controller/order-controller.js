const {
  Order, Item, OrderItem, User,
} = require('../models');
const { ResponseError } = require('../error/response-error');

const decreaseStock = async (items) => {
  if (!items || items.length === 0) {
    throw new Error('Items is null, undefined, or empty');
  }
  try {
    // Prepare an array of promises for decrementing the stock of each item
    const decrementPromises = items.map(async (item) => {
      await Item.decrement('stock', {
        by: item.quantity,
        where: { id: item.id },
      });
    });
    // Execute all the decrement operations concurrently
    await Promise.all(decrementPromises);
  } catch (error) {
    throw new ResponseError(`Failed to decrease stock: ${error.message}`);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;
    const isAdmin = await User.findOne({ where: { id: userId, is_admin: true } });

    if (isAdmin) {
      throw new ResponseError(400, 'ADMIN_CANT_CREATE_ORDER');
    }
    // Mengambil itemId
    const itemIds = items.map((item) => item.id);
    // Mengambil data Items dari Database
    const itemDB = await Item.findAll({
      where: { id: itemIds },
      raw: true, // mengambil data dengan format JavaScript biasa
      attributes: ['id', 'price', 'stock'],
    });

    // Cek apakah ada item yang tidak ditemukan
    if (itemDB.length !== items.length) {
      return res.status(400).json({ message: 'ITEM_NOT_FOUND' });
    }

    // Cek apakah ada item yang habis
    const outOfStockItems = itemDB
      .filter(
        (item) => item.stock < items.find((i) => i.id === item.id).quantity,
      )
      .map((item) => item.id);
    if (outOfStockItems.length > 0) {
      return res.status(400).json({
        message: `ITEM_OUT_OF_STOCK: [${outOfStockItems.join(', ')}]`,
      });
    }

    const mergedData = [];
    itemDB.forEach((itemInDB) => {
      mergedData.push({
        ...itemInDB,
        ...items.find((item) => itemInDB.id === item.id),
      });
    });

    const totalOrderPrice = mergedData.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const orderDB = await Order.create({
      user_id: req.user.id,
      address_to: req.body.order.address_to,
      total_order_price: totalOrderPrice,
      status: 'pending',
    });

    const orderDetails = mergedData.map((item) => ({
      order_id: orderDB.id,
      item_id: item.id,
      quantity: item.quantity,
    }));

    await decreaseStock(items);
    const orderItems = await OrderItem.bulkCreate(orderDetails);
    const data = {
      order_id: orderDB.id,
      user_id: orderDB.user_id,
      address_to: orderDB.address_to,
      total_order_price: orderDB.total_order_price,
      status: orderDB.status,
      items: orderItems.map((item) => ({
        id: item.item_id,
        quantity: item.quantity,
      })),
    };
    return res.status(201).json({ message: 'ORDER_CREATED', data });
  } catch (error) {
    next(error);
  }
};

const getUserOrder = async (req, res, next) => {
  try {
    const idUser = req.user.id;
    const order = await Order.findAll({
      where: { user_id: idUser },
      include: [
        {
          model: Item,
          as: 'items',
          attributes: ['id', 'item_name'],
          through: { attributes: ['quantity'] },
        },
      ],
    });
    return res.json({ data: order });
  } catch (error) {
    // Handle errors
    next(error);
  }
};

const getSpecifiedUserOrder = async (req, res, next) => {
  try {
    const idUser = req.user.id;
    const idOrder = req.params.orderId;
    const isIdOrderExist = await Order.findOne({
      where: { user_id: idUser, id: idOrder },
    });

    if (!isIdOrderExist) {
      throw new ResponseError(404, 'ORDER_NOT_FOUND');
    }

    const order = await Order.findAll({
      where: { user_id: idUser, id: idOrder },
      include: [
        {
          model: Item,
          as: 'items',
          attributes: ['id', 'item_name'],
          through: { attributes: ['quantity'] },
        },
      ],
    });
    return res.json({ data: order });
  } catch (error) {
    // Handle errors
    next(error);
  }
};

const getListOrder = async (req, res, next) => {
  try {
    const order = await Order.findAll({
      include: [
        {
          model: Item,
          as: 'items',
          attributes: ['id', 'item_name'],
          through: { attributes: ['quantity'] },
        },
      ],
    });
    return res.json({ data: order });
  } catch (error) {
    // Handle errors
    next(error);
  }
};

const putOrder = async (req, res, next) => {
  try {
    const orderById = req.params.orderId;

    const orderIndex = await Order.findByPk(orderById);
    if (!orderIndex) {
      return res.status(400).json({ message: 'ORDER_NOT_FOUND' });
    }

    await orderIndex.update({ status: 'completed' });
    return res.status(200).send({ message: 'ORDER_UPDATED' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  putOrder,
  getUserOrder,
  getSpecifiedUserOrder,
  getListOrder,
};
