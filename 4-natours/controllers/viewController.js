// ----------------------------------------------
// Imports
// ----------------------------------------------

import Tour from '../models/tourModel.js';
import User from '../models/userModel.js';
import Booking from '../models/bookingModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// ----------------------------------------------
// Overview of all available tours
// ----------------------------------------------

export const getOverview = catchAsync(async (req, res, next) => {
  // Get tour data from collection
  const tours = await Tour.find();

  // Render template using tour data
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

// ----------------------------------------------
// Get a tour
// ----------------------------------------------

export const getTour = catchAsync(async (req, res, next) => {
  // Get data for requested tour (+reviews, +guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) return next(new AppError('This tour does not exist!', 404));

  // Render template using data retrieved
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

// ----------------------------------------------
// Login
// ----------------------------------------------

export function login(req, res) {
  // Render template
  res.status(200).render('login', {
    title: 'Log in',
  });
}

// ----------------------------------------------
// Sign up
// ----------------------------------------------

export function signup(req, res) {
  // Render template
  res.status(200).render('signup', {
    title: 'Sign Up',
  });
}

// ----------------------------------------------
// Get account
// ----------------------------------------------

export const getAccount = (req, res) => {
  // Render template
  res.status(200).render('account', {
    title: 'Your account',
  });
};

// ----------------------------------------------
// Get current user tours
// ----------------------------------------------

export const getMyBookings = catchAsync(async (req, res, next) => {
  // Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Bookings',
    tours,
  });
});

// ----------------------------------------------
// Update user data
// ----------------------------------------------

export const updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      reuValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

// ----------------------------------------------
// Alert messages
// ----------------------------------------------

export const alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediately, please come back later.";

  next();
};
