// ----------------------------------------------
// Imports
// ----------------------------------------------

import mongoose from 'mongoose';

import Tour from './tourModel.js';

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
// Indexes
// ----------------------------------------------

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

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

// retrieve the document from the database
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.reviewDoc = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.reviewDoc.constructor.calcAverageRatings(this.reviewDoc.tour);
});

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

// ----------------------------------------------
// Static methods
// ----------------------------------------------

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// ----------------------------------------------
// Create model
// ----------------------------------------------

const Review = mongoose.model('Review', reviewSchema);

// ----------------------------------------------
// Exports
// ----------------------------------------------

export default Review;
