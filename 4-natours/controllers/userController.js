// ----------------------------------------------
// Imports
// ----------------------------------------------

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// ----------------------------------------------
// Helper function to filter objects
// ----------------------------------------------

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

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
// Update current user details
// ----------------------------------------------

exports.updateCurrentUser = catchAsync(async (req, res, next) => {
  // Displays error if user tries to update password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route does not accept password updates. Please use /updateMyPassword',
        400
      )
    );

  // Filter out unwanted field names
  const filteredBody = filterObj(req.body, 'name', 'email');

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// ----------------------------------------------
// Inactivate current user
// ----------------------------------------------

exports.deleteCurrentUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
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
// Update user
// ----------------------------------------------

exports.updateUser = factory.updateOne(User);

// ----------------------------------------------
// Delete user
// ----------------------------------------------

exports.deleteUser = factory.deleteOne(User);
