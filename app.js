require('dotenv').config();
const express = require('express');
const helmet = require('helmet');

const pinoHttp = require('pino-http');
const routerIndex = require('./src/routes/index-router');
const logger = require('./src/libs/logger');
const { errorNotFound, errorHttpEvent } = require('./src/middlewares');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(pinoHttp({ logger }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());

// API ROUTERS
app.use(routerIndex);

// ERROR HANDLERS
app.use(errorNotFound);
app.use(errorHttpEvent);

module.exports = app;
