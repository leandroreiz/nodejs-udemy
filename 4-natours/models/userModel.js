const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// ----------------------------------------------
// Create schema
// ----------------------------------------------

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please inform your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please inform a valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    select: false,
    validate: {
      // this validation works only on create() or save()
      validator: function (el) {
        return el === this.password;
      },
      message: 'The passwords must match',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
});

userSchema.pre('save', async function (next) {
  // Run this funcion only if password was modified
  if (!this.isModified('password')) return next();

  // Hash the password and delete passwordConfirm
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = null; // undefined
  next();
});

// ----------------------------------------------
// Validate password
// ----------------------------------------------

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// ----------------------------------------------
// Check if user changed password after creation
// ----------------------------------------------

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // Check if the password was changed after token creation
    return JWTTimestamp < changedTimestamp;
  }

  // Password not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
