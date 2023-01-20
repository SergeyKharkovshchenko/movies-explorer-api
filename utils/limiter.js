const limiters = require('express-rate-limit');

const limiter = limiters({
  windowMs: 15 * 60 * 1000,
  max: 300,
});

module.exports = { limiter };
