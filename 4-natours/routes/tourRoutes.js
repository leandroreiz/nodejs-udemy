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
} = require('../controllers/tourController');

// ----------------------------------------------
// Routes
// ----------------------------------------------
const router = express.Router();

// Custom routes
router.route('/top-tours').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);

// Main routes
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
