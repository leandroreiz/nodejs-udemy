// ----------------------------------------------
// Imports
// ----------------------------------------------

const express = require('express');
const {
  setTourUserIds,
  createReview,
  getReviews,
  updateReview,
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
  .post(protect, restrictTo('user'), setTourUserIds, createReview);

router.route('/:id').patch(updateReview).delete(deleteReview);

// ----------------------------------------------
// Exports
// ----------------------------------------------

module.exports = router;
