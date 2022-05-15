// ----------------------------------------------
// Imports
// ----------------------------------------------
const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const authController = require('../controllers/authController');

// ----------------------------------------------
// Routes
// ----------------------------------------------
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
