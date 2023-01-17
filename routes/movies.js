const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getAllSavedMovies,
  createMovie,
  deleteMovieById,
} = require("../controllers/movies");

router.get("/", getAllSavedMovies);
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .regex(/https{0,1}:\/\/.*/),
      trailerLink: Joi.string()
        .required()
        .regex(/https{0,1}:\/\/.*/),
      thumbnail: Joi.string()
        .required()
        .regex(/https{0,1}:\/\/.*/),
      movieId: Joi.string().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie
);
router.delete(
  "/:movieId",
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).required().hex(),
    }),
  }),
  deleteMovieById
);

module.exports = router;
