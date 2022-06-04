/* eslint-disable */

// ----------------------------------------------
// Imports
// ----------------------------------------------

import displayMap from './leaflet.js';
import { login, logout } from './login.js';
import { updateSettings } from './updateSettings.js';

// ----------------------------------------------
// DOM elements
// ----------------------------------------------

const map = document.getElementById('map');
const formLogin = document.getElementById('form--login');
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

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    updateSettings({ name, email }, 'data');
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
