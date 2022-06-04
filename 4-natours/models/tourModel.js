// ----------------------------------------------
// Imports
// ----------------------------------------------

import mongoose from 'mongoose';
import slugify from 'slugify';

// ----------------------------------------------
// Create schema
// ----------------------------------------------

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have 40 characters or less'],
      minlength: [10, 'A tour name must have at least 10 characters'],
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Ratings can not be more than 5.0'],
      set: val => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // THIS ONLY POINTS TO CURRENT DOC ON NEW DOCUMENT CREATION
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ----------------------------------------------
// Indexes
// ----------------------------------------------

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// ----------------------------------------------
// Virtual properties
// Note: Virtual props can't be used in queries
// ----------------------------------------------

tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// ----------------------------------------------
// Document middleware
// Note: Runs before .save() and .create(), only
// ----------------------------------------------

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// ----------------------------------------------
// Query middleware
// ----------------------------------------------

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

// ----------------------------------------------
// Aggregation middleware
// ----------------------------------------------

// tourSchema.pre('aggregate', function (next) {
//   // Add a new match at the beggining of pipeline
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

// ----------------------------------------------
// Create model
// ----------------------------------------------

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
