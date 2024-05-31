require('dotenv').config();
const fs = require('fs');

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  test: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME_PROD,
    password: process.env.DB_PASS_PROD,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST_PROD,
    port: process.env.DB_PORT_PROD,
    dialect: process.env.DB_DIALECT_PROD,
    dialectModule: require('pg'),
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: fs.readFileSync(`${__dirname}/root.crt`).toString(),
      },
    },
  },
};
