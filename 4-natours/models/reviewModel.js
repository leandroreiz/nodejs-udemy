// ----------------------------------------------
// Imports
// ----------------------------------------------

const mongoose = require('mongoose');

// ----------------------------------------------
// Create schema
// ----------------------------------------------
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'The tour can not be empty!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'The user can not be empty!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ----------------------------------------------
// Middlewares
// ----------------------------------------------

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// ----------------------------------------------
// Create model
// ----------------------------------------------

const Review = mongoose.model('Review', reviewSchema);

// ----------------------------------------------
// Exports
// ----------------------------------------------

module.exports = Review;
