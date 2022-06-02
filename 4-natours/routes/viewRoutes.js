// ----------------------------------------------
// Imports
// ----------------------------------------------

import express from 'express';
import { getOverview, getTour, login } from '../controllers/viewController.js';
import { isLoggedIn } from '../controllers/authController.js';

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

export default router;
