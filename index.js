require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');

const fs = require('fs');
const morgan = require('morgan');
const path = require('path');

const routerIndex = require('./src/routes/index-router');

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' },
);

// API ROUTERS
app.use(routerIndex);


// Morgan Log
app.use(
  morgan('combined', {
    stream: accessLogStream,
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  }),
);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});


