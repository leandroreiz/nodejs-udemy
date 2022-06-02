// ----------------------------------------------
// Imports
// ----------------------------------------------

import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';

export const getOverview = catchAsync(async (req, res, next) => {
  // Get tour data from collection
  const tours = await Tour.find();

  // Render template using tour data
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

export const getTour = catchAsync(async (req, res, next) => {
  // Get data for requested tour (+reviews, +guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

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
