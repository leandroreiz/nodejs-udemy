// ----------------------------------------------
// Imports
// ----------------------------------------------

const express = require('express');
const { getReviews, createReview } = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

// ----------------------------------------------
// Create routes
// ----------------------------------------------

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getReviews)
  .post(protect, restrictTo('user'), createReview);

// ----------------------------------------------
// Exports
// ----------------------------------------------

module.exports = router;
