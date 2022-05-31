// ----------------------------------------------
// Imports
// ----------------------------------------------

const express = require('express');
const {
  getOverview,
  getTour,
  login,
} = require('../controllers/viewController');

// ----------------------------------------------
// Routes
// ----------------------------------------------

// Tours pages
const router = express.Router();

router.get('/', getOverview);
router.get('/tour/:slug', getTour);

// Login
router.get('/login', login);

// ----------------------------------------------
// Exports
// ----------------------------------------------

module.exports = router;
