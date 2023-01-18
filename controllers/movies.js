const Movie = require('../models/movies');
const {
  ItemNotFoundError,
  BadRequestError,
  AccessDeniedError,
} = require('../middlewares/errors');

// const getAllSavedMovies = async (req, res, next) => {
//   try {
//     const movie = await Movie.find({});
//     return res.json(movie);
//   } catch (err) {
//     return next(err);
//   }
// };

const getAllSavedMovies = async (req, res, next) => {
  try {
    const movie = await Movie.find({});
    return res.json(movie.filter((movieObj) => movieObj.owner === req.user._id));
  } catch (err) {
    return next(err);
  }
};

const createMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  try {
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: req.user._id,
    });
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
      throw new ItemNotFoundError('Movie not found');
    }
    if (movieCheck.owner !== req.user._id) {
      throw new AccessDeniedError('Только владелец может удалить карточку');
    }
    const movie = await Movie.findByIdAndRemove(req.params.movieId);
    return res.json(movie);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Указан некорректный id'));
    }
    return next(err);
  }
};

module.exports = {
  getAllSavedMovies,
  createMovie,
  deleteMovieById,
};
