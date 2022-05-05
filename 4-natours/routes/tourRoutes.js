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
} = require('../controllers/tourController');

// ----------------------------------------------
// Routes
// ----------------------------------------------
const router = express.Router();

router.route('/').get(getAllTours).post(createTour);
router.route('/top-tours').get(aliasTopTours, getAllTours);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
