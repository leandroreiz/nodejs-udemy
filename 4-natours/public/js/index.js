/* eslint-disable */

// ----------------------------------------------
// Imports
// ----------------------------------------------

import { login, logout } from './login.js';
import { updateData } from './updateSettings.js';
import displayMap from './leaflet.js';

// ----------------------------------------------
// DOM elements
// ----------------------------------------------

const map = document.getElementById('map');
const formLogin = document.getElementById('form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const formUserData = document.querySelector('.form-user-data');

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

    updateData(name, email);
  });
}
