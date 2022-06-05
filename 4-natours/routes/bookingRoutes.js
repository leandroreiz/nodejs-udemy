// ----------------------------------------------
// Imports
// ----------------------------------------------

import express from 'express';

import { protect } from '../controllers/authController.js';
import { getCheckoutSession } from '../controllers/bookingController.js';

// ----------------------------------------------
// Create routes
// ----------------------------------------------

const router = express.Router();

// Stripe checkout route
router.get('/checkout-session/:tourId', protect, getCheckoutSession);

export default router;
