// ----------------------------------------------
// Imports
// ----------------------------------------------

const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

// ----------------------------------------------
// Get all tours
// ----------------------------------------------

exports.getAllTours = catchAsync(async (req, res, next) => {
  // ------------------------------------------
  // Build query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  // ------------------------------------------
  // Send response
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// ----------------------------------------------
// Get a tour
// ----------------------------------------------

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');

  if (!tour) return next(new AppError('No tour found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// ----------------------------------------------
// Create new tour
// ----------------------------------------------

exports.createTour = factory.createOne(Tour);

// ----------------------------------------------
// Update tour data
// ----------------------------------------------

exports.updateTour = factory.updateOne(Tour);

// ----------------------------------------------
// Delete tour
// ----------------------------------------------

exports.deleteTour = factory.deleteOne(Tour);

// ----------------------------------------------
// Top 5 tours (middleware)
// ----------------------------------------------

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// ----------------------------------------------
// General Stats using Aggregation pipeline
// ----------------------------------------------

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

// ----------------------------------------------
// Monthly plan
// ----------------------------------------------

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
