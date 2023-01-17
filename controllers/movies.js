const Movie = require('../models/movies');
const { ItemNotFoundError, BadRequestError, AccessDeniedError } = require('../middlewares/errors');

const getAllSavedMovies = async (req, res, next) => {
  try {
    const cards = await Movie.find({});
    return res.json(cards);
  } catch (err) {
    return next(err);
  }
};

const createMovie = async (req, res, next) => {
  const { name, link } = req.body;
  try {
    const card = await Movie.create({ name, link, owner: req.user._id });
    return res.json(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    }
    return next(err);
  }
};

const deleteMovieById = async (req, res, next) => {
  try {
    const cardCheck = await Movie.findById(req.params.cardId);
    if (!cardCheck) {
      throw new ItemNotFoundError('Card not found');
    }
    // eslint-disable-next-line eqeqeq
    if (cardCheck.owner != req.user._id) {
      throw new AccessDeniedError('Только владелец может удалить карточку');
    }
    const card = await Card.findByIdAndRemove(req.params.cardId);
    return res.json(card);
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
