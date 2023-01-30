const {
  SERVER_ERROR,
} = require('../utils/config');

const errorsHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode);
  res.json({
    message: statusCode === 500
      ? SERVER_ERROR
      : message,
  });
  console.log(res);
  next();
};

module.exports = errorsHandler;
