/* eslint-disable */

// ----------------------------------------------
// Imports
// ----------------------------------------------

import { showAlert } from './alerts.js';

// ----------------------------------------------
// Login function
// ----------------------------------------------

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');

      window.setTimeout(() => location.assign('/'), 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// ----------------------------------------------
// Logout function
// ----------------------------------------------

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') location.replace('/');
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
