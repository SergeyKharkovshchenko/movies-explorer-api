const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const authorizationRouter = require('./authorization');
const { checkAuth } = require('../middlewares/auth');
const { ItemNotFoundError } = require('../middlewares/errors');
const {
  WRONG_REQUEST,
} = require('../utils/config');

router.use(authorizationRouter);
router.use('/movies', checkAuth, movieRouter);
router.use('/users', checkAuth, userRouter);
router.use('*', (req, res, next) => next(new ItemNotFoundError(WRONG_REQUEST)));

module.exports = router;
