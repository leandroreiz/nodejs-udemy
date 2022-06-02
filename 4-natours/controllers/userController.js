// ----------------------------------------------
// Imports
// ----------------------------------------------

import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { getAll, getOne, updateOne, deleteOne } from './handlerFactory.js';

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
// Read current user details
// ----------------------------------------------

export function getCurrentUser(req, res, next) {
  req.params.id = req.user.id;
  next();
}

export const updateCurrentUser = catchAsync(async (req, res, next) => {
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

export const deleteCurrentUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// ----------------------------------------------
// Create user route treatment
// ----------------------------------------------

export function createUser(req, res, next) {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead.',
  });
}

export const getAllUsers = getAll(User);
export const getUser = getOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
