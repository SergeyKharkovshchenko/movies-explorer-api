const mongoose = require('mongoose');
const { default: isURL } = require('validator/lib/isURL');

const {
  WRONG_URL,
} = require('../utils/config');

const MovieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isURL(link),
      message: (props) => `${WRONG_URL} ${props.value}`,
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isURL(link),
      message: (props) => `${WRONG_URL} ${props.value}`,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isURL(link),
      message: (props) => `Неверный адрес: ${props.value}`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', MovieSchema);
