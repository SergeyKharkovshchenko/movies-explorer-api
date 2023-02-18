require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const { limiter } = require('./utils/limiter');
const errorsHandler = require('./middlewares/errorsHandler');

const { PORT = 3000 } = process.env;
const routers = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NODE_ENV } = process.env;
console.log(process.env.NODE_ENV);

const app = express();

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect('mongodb://127.0.0.1/bitfilmsdb');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const allowedCors = [
  'http://sergey-kh.dilpom.nomoredomainsclub.ru',
  'https://sergey-kh.dilpom.nomoredomainsclub.ru',
  'http://localhost:3000',
  'http://sergey-kh.dilpom.nomoredomainsclub.ru/',
  'https://sergey-kh.dilpom.nomoredomainsclub.ru/',
];

const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(requestLogger);
app.use(limiter);
app.use(cors(corsOptions));
// app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());

// app.get('/crash-test', () => {
//   process.nextTick(setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0));
// });
app.use(routers);
app.use(errorLogger);
app.use(errors());

app.use(errorsHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('listening for requests');
  });
});

// mongoose.connect(NODE_ENV === 'production' ? process.env.DB_CONNECTION_STRING : 'mongodb://127.0.0.1/bitfilmsdb', {
//   useNewUrlParser: true,
// }, () => {
//   app.listen(PORT, () => {
//     console.log(`App works, port ${PORT}`);
//   });
// });
