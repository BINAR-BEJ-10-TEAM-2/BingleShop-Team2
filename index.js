require('dotenv').config();
const express = require('express');

const routerIndex = require('./src/routes/index-router');
const { notFound, httpEvent } = require('./src/middlewares/error-middleware');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API ROUTERS
app.use(routerIndex);

// ERROR HANDLERS
app.use(notFound);
app.use(httpEvent);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
