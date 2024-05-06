const isAuthenticated = require('./isAuthenticated');
const errorNotFound = require('./errorNotFound');
const errorHttpEvent = require('./errorHttpEvent');
const isAdmin = require('./isAdmin');

module.exports = {
  isAuthenticated,
  errorNotFound,
  errorHttpEvent,
  isAdmin,
};
