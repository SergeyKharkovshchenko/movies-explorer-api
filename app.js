require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');
const { limiter } = require('./utils/limiter');
// const cors = require('cors');
const { ItemNotFoundError } = require('./middlewares/errors');
const errorsHandler = require('./middlewares/errorsHandler');
const { DB_CONNECTION_STRING } = require('./utils/config');

const { PORT = 3000 } = process.env;
const routers = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// const { NODE_ENV } = process.env;
console.log(process.env.NODE_ENV); // production

const app = express();

// const allowedCors = [
//   'http://sergey-kh.nomoredomains.club/',
//   'https://sergey-kh.nomoredomains.club/',
//   'http://sergey-kh.nomoredomains.club',
//   'https://sergey-kh.nomoredomains.club',
// ];

// const corsOptions = {
//   origin: allowedCors,
//   optionsSuccessStatus: 200,
//   credentials: true,
// };

app.use(requestLogger);
app.use(limiter);
// app.use(cors(corsOptions));
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());

// app.get('/crash-test', () => {
//   process.nextTick(setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0));
// });
app.use(routers);
app.use('*', (req, res, next) => next(new ItemNotFoundError('Неверный запрос')));

app.use(errorLogger);
app.use(errors());

app.use(errorsHandler);

mongoose.set('strictQuery', false);
// mongoose.connect(NODE_ENV === 'production' ? process.env.DB_CONNECTION_STRING : 'mongodb://127.0.0.1/mestodb', {
mongoose.connect(DB_CONNECTION_STRING, {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT, () => {
    console.log(`App works, port ${PORT}`);
  });
});
