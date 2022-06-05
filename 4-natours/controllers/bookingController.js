// ----------------------------------------------
// Imports
// ----------------------------------------------

import Stripe from 'stripe';

import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';

// ----------------------------------------------
// Create a stripe checkout session
// ----------------------------------------------

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  // Get the booked tour
  const tour = await Tour.findById(req.params.tourId);

  // Asign the secret key
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  // Send session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});
