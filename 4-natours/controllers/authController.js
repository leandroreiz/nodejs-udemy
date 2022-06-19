// ----------------------------------------------
// Imports
// ----------------------------------------------

import { promisify } from 'util';
import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Email from '../utils/email.js';
// import sendEmail from '../utils/email.js';

// ----------------------------------------------
// Sign Token
// ----------------------------------------------

const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// ----------------------------------------------
// Create and send token
// ----------------------------------------------

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  // Send cookie
  // Check for secure connection (https)
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove password from output
  user.password = null;

  // Send response
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// ----------------------------------------------
// Sign Up / Create user
// ----------------------------------------------

export const signup = catchAsync(async (req, res, next) => {
  // Specify fields to avoid admin accounts to be created
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  // Send welcome email
  const url = `${req.protocol}://${req.get('host')}/user`;
  await new Email(newUser, url).sendWelcome();

  // Sign JWT & send token and user details
  createSendToken(newUser, 201, req, res);
});

// ----------------------------------------------
// Login
// ----------------------------------------------

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password)
    return next(new AppError('Please provide email and password!', 400));

  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Invalid credentials', 401));

  // Send token to client
  createSendToken(user, 200, req, res);
});

// ----------------------------------------------
// Logout
// ----------------------------------------------

export const logout = (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

// ----------------------------------------------
// Protect routes
// ----------------------------------------------

export const protect = catchAsync(async (req, res, next) => {
  // Get token and check if exists
  let token;

  // Check for token on authorization headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check for token on browser cookies
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // Return an error if token doesn't exist
  if (!token) return next(new AppError('Please login to get access', 401));

  // Validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('The user associated with this token does not exist'),
      401
    );

  // Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );

  // Grant access to protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// ----------------------------------------------
// Check if user is logged in
// ----------------------------------------------

export const isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // Validate token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // Check if user exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();

      // Check if user changed password after token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) return next();

      // User is logged in
      res.locals.user = currentUser;
      return next();
    }
  } catch {
    // Do not return an error, just move to next middleware
    return next();
  }

  // If there is no cookie, move to next middleware
  next();
};

// ----------------------------------------------
// Restrict access
// ----------------------------------------------

export function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action!', 403)
      );

    next();
  };
}

// ----------------------------------------------
// Forgot password
// ----------------------------------------------

export const forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('Email address not found in our database!', 404));

  // Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    // Send to user's email
    await new Email(user, resetURL).sendpasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

// ----------------------------------------------
// Reset password
// ----------------------------------------------

export const resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on token
  const hashedToken = createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // Check if user exists
  if (!user) return next(new AppError('Token is invalid or has expired!', 400));

  // Update password for current user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();

  // Log the user in, send JWT
  createSendToken(user, 200, req, res);
});

// ----------------------------------------------
// Update password
// ----------------------------------------------

export const updatePassword = catchAsync(async (req, res, next) => {
  // Get user
  const user = await User.findById(req.user._id).select('+password');

  // Check if posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError('Invalid credentials!', 401));

  // Update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // Log user in, send JWT
  createSendToken(user, 200, req, res);
});
