const errorsHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode);
  res.json({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  console.log(res);
  next();
};

module.exports = errorsHandler;
