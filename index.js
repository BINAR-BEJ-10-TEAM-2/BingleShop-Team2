const logger = require('./src/libs/logger');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  logger.info(`Server app listening on http://localhost:${port}`);
});

process.on('unhandledRejection', (err) => {
  logger.info('UNHANDLER REJECTION! 💥 Shutting down...');
  logger.info(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info('👏 SIGTEM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});
