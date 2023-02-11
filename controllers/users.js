const bcryptjs = require('bcryptjs');
const JWT = require('jsonwebtoken');
const User = require('../models/user');
const {
  ItemNotFoundError,
  BadRequestError,
  UnauthorizedError,
  DoubleDataError,
} = require('../middlewares/errors');

const {
  WRONG_ID,
  USER_NOT_FOUND,
  SUCCESSFUL_AUTH,
  WRONG_USER_OR_PASS,
  EMAIL_EXISTS,
  SUCCESSFUL_LOGOUT,
} = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ItemNotFoundError(USER_NOT_FOUND);
    }
    return res
      .header('Access-Control-Allow-Origin: *')
      .status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError(WRONG_ID));
    }
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true, runValidators: true,
    });
    if (!user) {
      throw new ItemNotFoundError(USER_NOT_FOUND);
    }
    return res.json(user);
  } catch (err) {
    if (err.code === 11000) {
      return next(
        new DoubleDataError(EMAIL_EXISTS),
      );
    }
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const hash = await bcryptjs.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hash });
    return res
      .header('Access-Control-Allow-Origin: *')
      .status(201).json({
        name: user.name,
        email: user.email,
        _id: user._id,
      });
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
    if (err.code === 11000) {
      return next(
        new DoubleDataError(EMAIL_EXISTS),
      );
    }
    return next(err);
  }
};

const logout = (req, res, next) => {
  const { _id } = req.body;
  try {
    const token = JWT.sign(
      { _id },
      NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
      { expiresIn: -1 },
    );

    return res
      .header('Access-Control-Allow-Origin: *')
      .cookie('jwt', token, {
        maxAge: 0,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      // .clearCookie('jwt', {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: false,
      // })
      .json({ message: SUCCESSFUL_LOGOUT });
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new UnauthorizedError(WRONG_USER_OR_PASS));
    }
    const isLoggedIn = await bcryptjs.compare(password, user.password);
    if (!isLoggedIn) {
      return next(new UnauthorizedError(WRONG_USER_OR_PASS));
    }
    const token = JWT.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
      { expiresIn: '7d' },
    );
    return res
      .header('Access-Control-Allow-Origin: *')
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .json(user.name, user._id, user.email, { message: SUCCESSFUL_AUTH });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  updateProfile,
  getUserMe,
  createUser,
  login,
  logout,
};
