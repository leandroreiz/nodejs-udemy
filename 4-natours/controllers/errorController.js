// ----------------------------------------------
// Imports
// ----------------------------------------------

import AppError from '../utils/appError.js';

// ----------------------------------------------
// Cast error handling
// ----------------------------------------------

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// ----------------------------------------------
// Duplicate fields handling
// ----------------------------------------------

const handleDuplicateFieldsDB = err => {
  console.log(err);
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;

  return new AppError(message, 400);
};

// ----------------------------------------------
// Validation error handling
// ----------------------------------------------

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data! ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// ----------------------------------------------
// Invalid JWT provided
// ----------------------------------------------

const handleJsonWebTokenError = () =>
  new AppError('Invalid Token! Please log in again', 401);

// ----------------------------------------------
// JWT is expired
// ----------------------------------------------

const handleTokenExpiredError = () =>
  new AppError('Your token has expired! Please log in again', 401);

// ----------------------------------------------
// Send error to development
// ----------------------------------------------

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api'))
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });

  // Rendered website
  console.error('🔴 Unknown error:', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    message: err.message,
  });
};

// ----------------------------------------------
// Send error to production
// ----------------------------------------------

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error - Send message to client
    if (err.isOperational)
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

    // Programming or some unknown error - Don't leak error details to client
    console.error('🔴 Unknown error:', err);
    return res.status(err.statusCode).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }

  // Rendered website
  // Operational, trusted error - Send message to client
  if (err.isOperational)
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      message: err.message,
    });

  // Programming or some unknown error - Don't leak error details to client
  console.error('🔴 Unknown error:', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    message: 'Please try again later.',
  });
};

// ----------------------------------------------
// Check for environment
// ----------------------------------------------

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // @BUG / FIXED: but still need to check if it is okay to use 'err' to pass as a parameter
    if (err.name === 'CastError') error = handleCastErrorDB(error); // was using err
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError();

    sendErrorProd(error, req, res);
  }
};
