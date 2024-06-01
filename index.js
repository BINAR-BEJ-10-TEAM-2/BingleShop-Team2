const http = require('node:http');
const { Server } = require('socket.io');
const logger = require('./src/libs/logger');

const app = require('./app');

const server = http.createServer(app);

const port = process.env.PORT || 3000;

const listener = server.listen(port, () => {
  logger.info(`Server app listening on http://localhost:${port}`);
});

const socket = require('./src/controller/socket-controller');

const io = new Server(listener);

socket.setup(io);

process.on('unhandledRejection', (err) => {
  // logger.info('UNHANDLER REJECTION! 💥 Shutting down...');
  logger.info(err);
  listener.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info('👏 SIGTEM RECEIVED. Shutting down gracefully');
  listener.close(() => {
    logger.info('💥 Process terminated!');
  });
});
