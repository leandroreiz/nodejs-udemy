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

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// ----------------------------------------------
// Middleware
// ----------------------------------------------

// Http request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Provide request body parsing
app.use(express.json());

// ----------------------------------------------
// Routes
// ----------------------------------------------
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Dealing with unknown urls
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });

  next();
});

module.exports = app;
