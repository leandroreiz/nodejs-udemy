// ----------------------------------------------
// Imports
// ----------------------------------------------

const AppError = require('../utils/appError');

// ----------------------------------------------
// Error Handling Middleware
// ----------------------------------------------

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;

  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error
  // Send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or some unknown error
  // Don't leak error details to client
  else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);

  if (process.env.NODE_ENV === 'production') {
    let error;
    // @BUG / FIXED: but still need to check if it is okay to use 'err' to pass as a parameter to 'handleCastErrorDB'
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);

    sendErrorProd(error, res);
  }
};
