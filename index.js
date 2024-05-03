require('dotenv').config();
const express = require('express');

const routerIndex = require('./src/routes/index-router');
const { notFound, httpEvent } = require('./src/middlewares/error-middleware');

const logger = require('./src/libs/logger');
const pinoHttp = require('pino-http');

const app = express();
const port = 3000;

app.use(pinoHttp({ logger }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API ROUTERS
app.use(routerIndex);

// ERROR HANDLERS
app.use(notFound);
app.use(httpEvent);

app.listen(port, () => {
  logger.info(`Server app listening on http://localhost:${port}`);
});
