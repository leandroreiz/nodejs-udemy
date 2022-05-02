// ----------------------------------------------
// Imports
// ----------------------------------------------
const express = require('express');
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
  checkBody,
} = require('../controllers/tourController');

// ----------------------------------------------
// Routes
// ----------------------------------------------
const router = express.Router();

// Check IDs for all routes
router.param('id', checkId);

// Routes
router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
