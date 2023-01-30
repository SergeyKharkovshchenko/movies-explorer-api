const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login, logout } = require('../controllers/users');
const { checkAuth } = require('../middlewares/auth');
const {
  joiRequiredName, joiRequiredEmail, joiRequiredPassword,
} = require('../utils/validation');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: joiRequiredName(),
    email: joiRequiredEmail(),
    password: joiRequiredPassword(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: joiRequiredEmail(),
    password: joiRequiredPassword(),
  }),
}), login);

router.post('/signout', checkAuth, logout);

module.exports = router;
