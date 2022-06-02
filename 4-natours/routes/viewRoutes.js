// ----------------------------------------------
// Imports
// ----------------------------------------------

const express = require('express');
const {
  getOverview,
  getTour,
  login,
} = require('../controllers/viewController');
const { protect } = require('../controllers/authController');

// ----------------------------------------------
// Routes
// ----------------------------------------------

// Tours pages
const router = express.Router();

router.get('/', getOverview);
router.get('/tour/:slug', protect, getTour);

// Login
router.get('/login', login);

// ----------------------------------------------
// Exports
// ----------------------------------------------

module.exports = router;
