const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');
// const { default: isURL } = require('validator/lib/isURL');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: (props) => `Неверный емейл: ${props.value}`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

module.exports = mongoose.model('user', UserSchema);
