// ----------------------------------------------
// Imports
// ----------------------------------------------

import express from 'express';

import {
  setTourUserIds,
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../controllers/authController.js';

// ----------------------------------------------
// Create routes
// ----------------------------------------------

const router = express.Router({ mergeParams: true });

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getReviews)
  .post(restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

// ----------------------------------------------
// Exports
// ----------------------------------------------

export default router;
