// ----------------------------------------------
// Imports
// ----------------------------------------------
import express from 'express';

import {
  getAllUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  uploadUserPhoto,
  resizeUserPhoto,
} from '../controllers/userController.js';
import {
  signup,
  login,
  logout,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/authController.js';

// ----------------------------------------------
// Routes
// ----------------------------------------------
const router = express.Router();

// Free access routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Routes after this middleware are protected
router.use(protect);
router.patch('/updateMyPassword', updatePassword);
router.get('/currentUser', getCurrentUser, getUser);
router.patch(
  '/updateCurrentUser',
  uploadUserPhoto,
  resizeUserPhoto,
  updateCurrentUser
);
router.delete('/deleteCurrentUser', deleteCurrentUser);

// Routes restricted to admin access
router.use(restrictTo('admin'));
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
