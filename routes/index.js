const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const authorizationRouter = require('./authorization');
const { checkAuth } = require('../middlewares/auth');

router.use(authorizationRouter);
router.use(checkAuth);
router.use('/movies', movieRouter);
router.use('/users', userRouter);

module.exports = router;
