module.exports = {
  // not found error handler
  notFound: (req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
  },

  // wrap all error http event
  httpEvent: (err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
      data: err.data,
    });
  },
};
