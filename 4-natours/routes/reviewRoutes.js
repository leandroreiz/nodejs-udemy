// ----------------------------------------------
// Imports
// ----------------------------------------------

const express = require('express');
const {
  getReviews,
  createReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

// ----------------------------------------------
// Create routes
// ----------------------------------------------

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getReviews)
  .post(protect, restrictTo('user'), createReview);

router.route('/:id').delete(deleteReview);

// ----------------------------------------------
// Exports
// ----------------------------------------------

module.exports = router;
