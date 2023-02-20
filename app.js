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

// eslint-disable-next-line no-unused-vars
const { NODE_ENV } = process.env;
console.log(process.env.NODE_ENV);

const app = express();

const allowedCors = [
  'http://sergey-kh.dilpom.nomoredomainsclub.ru',
  'https://sergey-kh.dilpom.nomoredomainsclub.ru',
  'http://localhost:3000',
  'http://sergey-kh.dilpom.nomoredomainsclub.ru/',
  'https://sergey-kh.dilpom.nomoredomainsclub.ru/',
  'https://movies-explorer-frontend-ivory.vercel.app/',
  'https://movies-explorer-frontend-ivory.vercel.app',
];

const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  credentials: true,
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.DB_CONNECTION_STRING,
      {
        useNewUrlParser: true,
      },
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
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

mongoose.set('strictQuery', false);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('listening for requests');
  });
});
