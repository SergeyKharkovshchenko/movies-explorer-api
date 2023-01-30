const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { updateProfile, getUserMe } = require('../controllers/users');

const {
  joiRequiredName, joiRequiredEmail,
} = require('../utils/validation');

router.get('/me', getUserMe);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: joiRequiredName(),
      email: joiRequiredEmail(),
    }),
  }),
  updateProfile,
);

module.exports = router;
