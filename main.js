const logger = require('./src/libs/logger');
const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Server app listening on http://localhost:${port}`);
});
