// ----------------------------------------------
// Imports
// ----------------------------------------------
const express = require('express');
const {
  getAllUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
} = require('../controllers/userController');
const {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');

// ----------------------------------------------
// Routes
// ----------------------------------------------
const router = express.Router();

// Free access routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Routes after this middleware are protected
router.use(protect);
router.patch('/updateMyPassword', updatePassword);
router.get('/currentUser', getCurrentUser, getUser);
router.patch('/updateCurrentUser', updateCurrentUser);
router.delete('/deleteCurrentUser', deleteCurrentUser);

// Routes restricted to admin access
router.use(restrictTo('admin'));
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
