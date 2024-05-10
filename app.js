require('dotenv').config();
const express = require('express');

const pinoHttp = require('pino-http');
const routerIndex = require('./src/routes/index-router');
const logger = require('./src/libs/logger');
const { errorNotFound, errorHttpEvent } = require('./src/middlewares');

const app = express();

app.use(pinoHttp({ logger }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API ROUTERS
app.use(routerIndex);

// ERROR HANDLERS
app.use(errorNotFound);
app.use(errorHttpEvent);

module.exports = app;
