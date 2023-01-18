const Movie = require('../models/movies');
const {
  ItemNotFoundError,
  BadRequestError,
  AccessDeniedError,
} = require('../middlewares/errors');

const {
  NOT_OWNER_TRIES_TO_DELETE,
  WRONG_ID,
  MOVIE_NOT_FOUND,
} = require('../utils/config');

const getAllSavedMovies = async (req, res, next) => {
  try {
    const movie = await Movie.find({});
    // eslint-disable-next-line eqeqeq
    return res.json(movie.filter((movieObj) => movieObj.owner == req.user._id));
  } catch (err) {
    return next(err);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create({ ...req.body, owner: req.user._id });
    return res.json(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(
        new BadRequestError(
          `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        ),
      );
    }
    return next(err);
  }
};

const deleteMovieById = async (req, res, next) => {
  try {
    const movieCheck = await Movie.findById(req.params.movieId);
    if (!movieCheck) {
      throw new ItemNotFoundError(MOVIE_NOT_FOUND);
    }
    // eslint-disable-next-line eqeqeq
    if (movieCheck.owner != req.user._id) {
      throw new AccessDeniedError(NOT_OWNER_TRIES_TO_DELETE);
    }
    const movie = await Movie.findByIdAndRemove(req.params.movieId);
    return res.json(movie);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError(WRONG_ID));
    }
    return next(err);
  }
};

module.exports = {
  getAllSavedMovies,
  createMovie,
  deleteMovieById,
};
