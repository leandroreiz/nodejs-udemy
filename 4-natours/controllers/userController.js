// ----------------------------------------------
// Imports
// ----------------------------------------------
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

// ----------------------------------------------
// Get all users
// ----------------------------------------------
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // ------------------------------------------
  // Send response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

// ----------------------------------------------
// Get user
// ----------------------------------------------
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// ----------------------------------------------
// Create new user
// ----------------------------------------------
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// ----------------------------------------------
// Update user
// ----------------------------------------------
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// ----------------------------------------------
// Delete user
// ----------------------------------------------
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
