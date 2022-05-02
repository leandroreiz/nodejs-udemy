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
// Controllers
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
  const tour = tours.find(tour => tour.id === +req.params.id);

  try {
    if (!tour) throw new Error('Invalid ID');

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
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
    err => {
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
