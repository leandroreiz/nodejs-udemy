/* eslint-disable */

const login = async (email, password) => {
  console.log(email, password);
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    console.log(result);
  } catch (err) {
    console.log(err);
  }
};

document.querySelector('.form').addEventListener('submit', e => {
  e.prevent.default();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login({ email, password });
});
