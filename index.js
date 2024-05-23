const logger = require('./src/libs/logger');
const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Server app listening on http://localhost:${port}`);
});

process.on('unhandledRejection', (err) => {
  logger.info('UNHANDLER REJECTION! 💥 Shutting down...');
  logger.info(err.name, err.message);
  app.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info('👏 SIGTEM RECEIVED. Shutting down gracefully');
  app.close(() => {
    logger.info('💥 Process terminated!');
  });
});
