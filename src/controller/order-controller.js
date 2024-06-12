const {
  Order, Item, OrderItem,
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

    // Check if the items array is empty or null
    if (!items || items.length === 0) {
      throw new ResponseError(400, 'NO_ITEMS_IN_ORDER');
    }

    // Extract the is_admin property from the user object in the request
    const { is_admin: isAdmin } = req.user;

    // Check if the user is an admin
    if (isAdmin) {
      throw new ResponseError(400, 'ADMIN_CANT_CREATE_ORDER');
    }

    // Extract the id property from each item and convert it to an integer
    const itemIds = items.map((item) => parseInt(item.id, 10));

    // Find all the items in the database that match the itemIds
    const itemDB = await Item.findAll({
      where: { id: itemIds },
      raw: true,
      attributes: ['id', 'price', 'stock'],
    });

    // Convert the id property of each item in itemDB to an integer
    itemDB.forEach((item) => {
      item.id = parseInt(item.id, 10);
    });

    // Initialize arrays to store missing and out of stock item ids
    const missingItemIds = [];
    const outOfStockItemIds = [];
    let totalOrderPrice = 0;

    // Iterate over each item in the request
    items.forEach((item) => {
      // Find the item in itemDB that matches the current item's id
      const foundItem = itemDB.find((dbItem) => dbItem.id === item.id);

      // If the item is not found in itemDB, add its id to the missingItemIds array
      if (!foundItem) {
        missingItemIds.push(item.id);
      } else if (foundItem.stock < item.quantity) {
        // If the item's stock is less than the quantity, add its id to the outOfStockItemIds array
        outOfStockItemIds.push(item.id);
      } else {
        // Otherwise, calculate the total order price
        totalOrderPrice += foundItem.price * item.quantity;
      }
    });

    // If there are missing item ids, throw an error
    if (missingItemIds.length > 0) {
      throw new ResponseError(400, `ITEM_NOT_FOUND: [${missingItemIds.join(', ')}]`);
    }

    // If there are out of stock item ids, throw an error
    if (outOfStockItemIds.length > 0) {
      throw new ResponseError(400, `ITEM_OUT_OF_STOCK: [${outOfStockItemIds.join(', ')}]`);
    }

    // Create a new order in the database
    const orderDB = await Order.create({
      user_id: req.user.id,
      address_to: req.body.order.address_to,
      total_order_price: totalOrderPrice,
      status: 'pending',
    });

    // Create an array of order details for each item in the request
    const orderDetails = items.map((item) => ({
      order_id: orderDB.id,
      item_id: item.id,
      quantity: item.quantity,
    }));

    // Decrease the stock of each item in the request
    await decreaseStock(items);

    // Create the order items in the database with the order details array
    const orderItems = await OrderItem.bulkCreate(orderDetails);

    // Create a response data object
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

    // Send a success response with the order data
    return res.status(201).json({ message: 'ORDER_CREATED', data });
  } catch (error) {
    // Handle errors
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
    return res.json({
      length: order.length,
      data: order,
    });
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
    return res.json({
      length: order.length,
      data: order,
    });
  } catch (error) {
    // Handle errors
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const orderById = req.params.orderId;

    const orderIndex = await Order.findByPk(orderById);
    if (!orderIndex) {
      throw new ResponseError(404, 'ORDER_NOT_FOUND');
    }

    await orderIndex.update({ status: 'completed' });
    return res.status(200).send({ message: 'ORDER_UPDATED' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  updateOrder,
  getUserOrder,
  getSpecifiedUserOrder,
  getListOrder,
};
