/* eslint-disable */

// ----------------------------------------------
// Imports
// ----------------------------------------------

import { login, logout } from './login.js';
import displayMap from './leaflet.js';

// DOM elements
const map = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');

// ----------------------------------------------
// Delegation
// ----------------------------------------------

// Display the map if it exists
if (map) {
  const locations = JSON.parse(map.dataset.locations);
  displayMap(locations);
}

// Submit login form
if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    // Log in form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });

// User logout
if (logoutBtn) logoutBtn.addEventListener('click', logout);
