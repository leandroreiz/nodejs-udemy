// ----------------------------------------------
// Imports
// ----------------------------------------------

import express from 'express';
import {
  getTour,
  getOverview,
  getAccount,
  login,
  signup,
  updateUserData,
  getMyBookings,
  alerts,
} from '../controllers/viewController.js';
import { isLoggedIn, protect } from '../controllers/authController.js';

// ----------------------------------------------
// Routes
// ----------------------------------------------

const router = express.Router();

router.use(alerts);

// Tours pages
router.get('/', isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);

// Login
router.get('/login', isLoggedIn, login);

// Create user
router.get('/signup', signup);

// User
router.get('/user', protect, getAccount);
router.get('/my-bookings/', protect, getMyBookings);
router.post('/submit-user-data', protect, updateUserData);

// ----------------------------------------------
// Exports
// ----------------------------------------------

export default router;
