// ----------------------------------------------
// Imports
// ----------------------------------------------

import Stripe from 'stripe';

import Tour from '../models/tourModel.js';
import Booking from '../models/bookingModel.js';
import catchAsync from '../utils/catchAsync.js';
import {
  getOne,
  getAll,
  createOne,
  updateOne,
  deleteOne,
} from '../controllers/handlerFactory.js';

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
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
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

// ----------------------------------------------
// Create booking checkout
// ----------------------------------------------

export const createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is TEMPORARY as this code is not secure
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

// ----------------------------------------------
// Booking CRUD methods
// ----------------------------------------------

export const createBooking = createOne(Booking);
export const getBooking = getOne(Booking);
export const getBookings = getAll(Booking);
export const updateBooking = updateOne(Booking);
export const deleteBooking = deleteOne(Booking);
