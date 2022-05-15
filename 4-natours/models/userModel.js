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
});

userSchema.pre('save', async function (next) {
  // Run this funcion only if password was modified
  if (!this.isModified('password')) return next();

  // Hash the password and delete passwordConfirm
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = null; // undefined
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
