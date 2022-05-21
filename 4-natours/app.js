// ----------------------------------------------
// NATOURS APP
// Ver.: 1.0.0
// Design: Jonas Schmedtmann
// Coded by Leandro Reis
// ----------------------------------------------
// Imports
// ----------------------------------------------
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// ----------------------------------------------
// Global Middlewares
// ----------------------------------------------

// Http request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiter
const limiter = rateLimit({
  max: 3,
  windowMs: 60 * 60 * 1000,
  message:
    'Too many consecutive requests were attempted! Please try again in an hour!',
});

app.use('/api', limiter);

// Provide request body parsing
app.use(express.json());

// ----------------------------------------------
// Routes
// ----------------------------------------------
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Dealing with unknown urls
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
