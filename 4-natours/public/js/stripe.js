/* eslint-disable */

// ----------------------------------------------
// Imports
// ----------------------------------------------

import { showAlert } from './alerts.js';

// ----------------------------------------------
// Book tour and charge customer
// ----------------------------------------------

const stripe = Stripe(
  'pk_test_51L7HAnLoj30jCn5PWmcJYDEHM5qrv6yYDo3flgpqjsRvHA0jKEkZWTS7uAWqxw9uh7rZDyJW7t9bfYBEdPLEeD0800ChfMygK9'
);

export const bookTour = async tourId => {
  try {
    // Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.error(err);
    showAlert('error', err);
  }
};
