// ----------------------------------------------
// Imports
// ----------------------------------------------

import Review from '../models/reviewModel.js';
import {
  createOne,
  getOne,
  getAll,
  updateOne,
  deleteOne,
} from './handlerFactory.js';

// ----------------------------------------------
// Middleware
// ----------------------------------------------

export function setTourUserIds(req, res, next) {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
}

export const createReview = createOne(Review);
export const getReview = getOne(Review);
export const getReviews = getAll(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
