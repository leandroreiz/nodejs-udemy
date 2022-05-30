// ----------------------------------------------
// Imports
// ----------------------------------------------

const express = require('express');
const {
  aliasTopTours,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

// ----------------------------------------------
// Routes
// ----------------------------------------------

const router = express.Router();

// Nested routes
router.use('/:tourId/reviews', reviewRouter);

// Custom routes
router.route('/top-tours').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

// Geospatial routes
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

// Main routes
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
