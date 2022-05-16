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
} = require('../controllers/tourController');
const { protect } = require('../controllers/authController');

// ----------------------------------------------
// Routes
// ----------------------------------------------
const router = express.Router();

// Custom routes
router.route('/top-tours').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

// Main routes
router.route('/').get(protect, getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
