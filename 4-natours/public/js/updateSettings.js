/* eslint-disable */

// ----------------------------------------------
// Imports
// ----------------------------------------------

import { showAlert } from './alerts.js';

// ----------------------------------------------
// Update name & email
// ----------------------------------------------

export const updateData = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:8000/api/v1/users/updateCurrentUser',
      data: {
        name,
        email,
      },
    });

    if (res.data.status === 'success')
      showAlert('success', 'Data updated successfully!');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
