const DB_CONNECTION_STRING = 'mongodb://127.0.0.1/bitfilmsdb';
const WRONG_ID = 'Указан некорректный id';
const USER_NOT_FOUND = 'User not found';
const SUCCESSFUL_AUTH = 'Авторизация прошла успешно';
const WRONG_USER_OR_PASS = 'Неверный пользователь или пароль';
const EMAIL_EXISTS = 'Вы пытаетесь зарегистрироваться по уже существующему в базе email';
const NOT_OWNER_TRIES_TO_DELETE = 'Только владелец может удалить фильм';
const MOVIE_NOT_FOUND = 'Movie not found';
const SUCCESSFUL_LOGOUT = 'Логаут прошел успешно';
const WRONG_REQUEST = 'Неверный запрос';

module.exports = {
  DB_CONNECTION_STRING,
  WRONG_ID,
  USER_NOT_FOUND,
  MOVIE_NOT_FOUND,
  SUCCESSFUL_AUTH,
  WRONG_USER_OR_PASS,
  EMAIL_EXISTS,
  NOT_OWNER_TRIES_TO_DELETE,
  SUCCESSFUL_LOGOUT,
  WRONG_REQUEST,
};
