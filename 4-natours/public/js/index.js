/* eslint-disable */

// ----------------------------------------------
// Imports
// ----------------------------------------------

import displayMap from './leaflet.js';

import { signup } from './signup.js';
import { bookTour } from './stripe.js';
import { showAlert } from './alerts.js';
import { login, logout } from './login.js';
import { updateSettings } from './updateSettings.js';

// ----------------------------------------------
// DOM elements
// ----------------------------------------------

const map = document.getElementById('map');
const bookBtn = document.getElementById('book-tour');
const formLogin = document.getElementById('form--login');
const formSignUp = document.getElementById('form--signup');
const logoutBtn = document.querySelector('.nav__el--logout');
const formUserData = document.querySelector('.form-user-data');
const formUserPassword = document.querySelector('.form-user-password');

// ----------------------------------------------
// Delegation
// ----------------------------------------------

// Display the map if it exists
if (map) {
  const locations = JSON.parse(map.dataset.locations);
  displayMap(locations);
}

// Submit create user form
if (formSignUp)
  formSignUp.addEventListener('submit', e => {
    e.preventDefault();

    // Sign up form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    signup(name, email, password, passwordConfirm);
  });

// Submit login form
if (formLogin)
  formLogin.addEventListener('submit', e => {
    e.preventDefault();

    // Log in form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });

// User logout
if (logoutBtn) logoutBtn.addEventListener('click', logout);

// Update current user details
if (formUserData) {
  formUserData.addEventListener('submit', e => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}

// Change current user password
if (formUserPassword) {
  formUserPassword.addEventListener('submit', async e => {
    e.preventDefault();

    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    // Update btn text
    document.querySelector('.btn--save-password').textContent = 'Save Password';

    // Clear fields after update
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

// Book tour using Stripe
if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

// Display alert message, if any
const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
