const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllSavedMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');
const {
  joiRequiredString, joiRequiredNumber, joiRequiredUrl, joiRequiredId,
} = require('../utils/validation');

router.get('/', getAllSavedMovies);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: joiRequiredString(),
      director: joiRequiredString(),
      duration: joiRequiredNumber(),
      year: joiRequiredString(),
      description: joiRequiredString(),
      image: joiRequiredUrl(),
      trailerLink: joiRequiredUrl(),
      thumbnail: joiRequiredUrl(),
      movieId: joiRequiredNumber(),
      nameRU: joiRequiredString(),
      nameEN: joiRequiredString(),
    }),
  }),
  createMovie,
);

router.delete(
  '/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: joiRequiredId(),
    }),
  }),
  deleteMovieById,
);

module.exports = router;
