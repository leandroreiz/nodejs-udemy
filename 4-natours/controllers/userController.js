// ----------------------------------------------
// Imports
// ----------------------------------------------
import multer from 'multer';
import sharp from 'sharp';

import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { getAll, getOne, updateOne, deleteOne } from './handlerFactory.js';

// ----------------------------------------------
// Multer config (uploading files)
// ----------------------------------------------

// Uploading to file system
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

// Using the buffer
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else
    cb(
      new AppError(
        'The file uploaded is not an image! Please upload an image file.',
        400
      ),
      false
    );
};

// Pass variables to multer middleware
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single('photo');

// ----------------------------------------------
// Rezing images
// ----------------------------------------------

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

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

// ----------------------------------------------
// Update current user details
// ----------------------------------------------

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
  if (req.file) filteredBody.photo = req.file.filename;

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
// Delete current user
// ----------------------------------------------

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
