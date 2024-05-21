const { ResponseError } = require('../error/response-error');

module.exports = (req, res, next) => {
  if (req.user.is_admin) {
    return next();
  }

  // return res.sendStatus(403);
  throw new ResponseError(403, 'Forbidden');
};
