/* eslint-disable */

// ----------------------------------------------
// Hide an alert message
// ----------------------------------------------

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// ----------------------------------------------
// Show an alert message
// ----------------------------------------------

// type should be 'success' or 'error'
export const showAlert = (type, message, time = 7) => {
  hideAlert();

  const markup = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, time * 1000);
};
