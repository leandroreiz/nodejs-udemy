/* eslint-disable */

// ----------------------------------------------
// Imports
// ----------------------------------------------

import { login } from './login.js';
import displayMap from './leaflet.js';

// DOM elements
const map = document.getElementById('map');
const loginForm = document.querySelector('.form');

// ----------------------------------------------
// Delegation
// ----------------------------------------------

// Display the map if it exists
if (map) {
  const locations = JSON.parse(map.dataset.locations);
  displayMap(locations);
}

// Submit handler
if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    // Log in form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
