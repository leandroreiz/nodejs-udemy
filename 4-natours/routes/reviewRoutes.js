// ----------------------------------------------
// Imports
// ----------------------------------------------

const express = require('express');
const {
  setTourUserIds,
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

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

module.exports = router;
