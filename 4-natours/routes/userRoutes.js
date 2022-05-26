// ----------------------------------------------
// Imports
// ----------------------------------------------
const express = require('express');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
} = require('../controllers/userController');
const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');

// ----------------------------------------------
// Routes
// ----------------------------------------------
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);

router.get('/currentUser', protect, getCurrentUser, getUser);
router.patch('/updateCurrentUser', protect, updateCurrentUser);
router.delete('/deleteCurrentUser', protect, deleteCurrentUser);

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
