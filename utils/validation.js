const { Joi } = require('celebrate');

const joiRequiredString = () => Joi.string().required();
const joiRequiredNumber = () => Joi.number().required();
const joiRequiredName = () => Joi.string().required().min(2).max(30);
const joiRequiredUrl = () => Joi.string().required().regex(/https{0,1}:\/\/.*/);
const joiRequiredEmail = () => Joi.string().required().email();
const joiRequiredPassword = () => Joi.string().required();
const joiRequiredId = () => Joi.string().length(24).required().hex();

module.exports = {
  joiRequiredString,
  joiRequiredNumber,
  joiRequiredName,
  joiRequiredUrl,
  joiRequiredEmail,
  joiRequiredPassword,
  joiRequiredId,
};
