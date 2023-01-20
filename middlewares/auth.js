const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('./errors');

const { NODE_ENV, JWT_SECRET } = process.env;
const {
  NOT_AUTH,
} = require('../utils/config');

const checkAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnauthorizedError(NOT_AUTH));
    return;
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (e) {
    next(new UnauthorizedError(NOT_AUTH));
    return;
  }
  req.user = { _id: payload._id };
  next();
};

module.exports = { checkAuth };
