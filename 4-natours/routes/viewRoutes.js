// ----------------------------------------------
// Imports
// ----------------------------------------------

const express = require('express');
const { getOverview, getTour } = require('../controllers/viewController');

// ----------------------------------------------
// Routes
// ----------------------------------------------

const router = express.Router();

router.get('/', getOverview);
router.get('/tour/:slug', getTour);

// ----------------------------------------------
// Exports
// ----------------------------------------------

module.exports = router;
