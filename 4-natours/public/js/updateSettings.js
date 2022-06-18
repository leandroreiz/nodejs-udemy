/* eslint-disable */

// ----------------------------------------------
// Imports
// ----------------------------------------------

import { showAlert } from './alerts.js';

// ----------------------------------------------
// Update name & email
// ----------------------------------------------

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateCurrentUser';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success')
      showAlert(
        'success',
        `${
          // capitalize
          type[0].toUpperCase() + type.slice(1).toLowerCase()
        } updated successfully!`
      );
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
