// ----------------------------------------------
// Imports
// ----------------------------------------------

import express from 'express';
import {
  getTour,
  getOverview,
  getAccount,
  login,
  updateUserData,
} from '../controllers/viewController.js';
import { isLoggedIn, protect } from '../controllers/authController.js';
import { createBookingCheckout } from '../controllers/bookingController.js';

// ----------------------------------------------
// Routes
// ----------------------------------------------

const router = express.Router();

// Tours pages
router.get('/', createBookingCheckout, isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);

// Login
router.get('/login', isLoggedIn, login);

// User
router.get('/user', protect, getAccount);
router.post('/submit-user-data', protect, updateUserData);

// ----------------------------------------------
// Exports
// ----------------------------------------------

export default router;
