const express = require('express');
const bcrypt = require('bcrypt');

const fs = require('fs');
const morgan = require('morgan');
const path = require('path');

const { Item, Order } = require('./models');
const routerIndex = require('./routes/index-router');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

// API ROUTERS
app.use(routerIndex);

// Items
app.get('/api/v2/items', async (req, res) => {
  const items = await Item.findAll();

  return res.json({
    success: 1,
    length: items.length,
    data: items,
  });
});

// Orders
app.post('/api/v2/orders', async (req, res) => {
  const orders = new Order();
  orders.address_to = req.body.address_to;
  orders.quantity = req.body.quantity;
  orders.status = 'pending';

  console.log('CHECKED => ', orders);
  await orders.save();

  return res.json({
    success: 1,
    message: 'ORDER_CREATED',
    data: {
      id: orders.id,
      address_to: orders.address_to,
      quantity: orders.quantity,
      status: orders.status,
    },
  });
});
app.put('/api/v2/orders/:id', async (req, res) => {
  const orderId = req.params.id;

  const orders = Order;
  orders.status = 'completed';

  // console.log("ORDER_ID",req)
  const orderIndex = await Order.findOne({ where: { id: orderId } });
  console.log('INI ORDER INDEX', orderIndex);
  if (!orderIndex) {
    // await orders.save();
    return res.send('ORDER_NOT_FOUND');
  }
  await orders.update(
    { status: orders.status },
    {
      where: {
        id: orderId,
      },
    }
  );
  return res.send('ORDER_UPDATED');
});

// Morgan Log
app.use(
  morgan('combined', {
    stream: accessLogStream,
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
