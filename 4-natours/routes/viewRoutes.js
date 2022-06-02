// ----------------------------------------------
// Imports
// ----------------------------------------------

const express = require('express');
const {
  getOverview,
  getTour,
  login,
} = require('../controllers/viewController');
const { isLoggedIn } = require('../controllers/authController');

// ----------------------------------------------
// Routes
// ----------------------------------------------

const router = express.Router();

router.use(isLoggedIn);

// Tours pages
router.get('/', getOverview);
router.get('/tour/:slug', getTour);
// Login
router.get('/login', login);

// ----------------------------------------------
// Exports
// ----------------------------------------------

module.exports = router;
