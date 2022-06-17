// ----------------------------------------------
// Imports
// ----------------------------------------------

import express from 'express';

import { protect, restrictTo } from '../controllers/authController.js';
import {
  getBooking,
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  getCheckoutSession,
} from '../controllers/bookingController.js';

// ----------------------------------------------
// Create routes
// ----------------------------------------------

const router = express.Router();

// Protect routes below
router.use(protect);

// Stripe checkout route
router.get('/checkout-session/:tourId', getCheckoutSession);

// Get all and create bookings
router.route('/').get(getBookings).post(createBooking);

// Restricting access to admin and lead-guide only
router.use(restrictTo('admin', 'lead-guide'));

// Get one specific booking, update or delete
router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

export default router;
