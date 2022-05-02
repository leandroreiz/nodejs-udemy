// ----------------------------------------------
// Imports
// ----------------------------------------------
const fs = require('fs');

// ----------------------------------------------
// Variables
// ----------------------------------------------
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// ----------------------------------------------
// Middlewares
// ----------------------------------------------

// Validade/check ID
exports.checkId = (req, res, next, id) => {
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  next();
};

// Check for name and price properties on body
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price)
    return res
      .status(400)
      .json({ status: 'fail', message: 'Missing name or price' });

  next();
};

// ----------------------------------------------
// Get all tours
// ----------------------------------------------
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestAt: req.requestTime,
    data: {
      tours,
    },
  });
};

// ----------------------------------------------
// Get a tour
// ----------------------------------------------
exports.getTour = (req, res) => {
  const tour = tours.find(el => el.id === +req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// ----------------------------------------------
// Create new tour
// ----------------------------------------------
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

// ----------------------------------------------
// Update tour data
// ----------------------------------------------
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour should go here...>',
    },
  });
};

// ----------------------------------------------
// Delete tour
// ----------------------------------------------
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
