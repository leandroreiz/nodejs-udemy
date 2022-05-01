// ----------------------------------------------
// NATOURS APP
// Ver.: 1.0.0
// Design: Jonas Schmedtmann
// Coded by Leandro Reis
// ----------------------------------------------
// Imports
// ----------------------------------------------
const express = require('express');
const fs = require('fs');

// ----------------------------------------------
// Global variables
// ----------------------------------------------
const app = express();
const port = 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// ----------------------------------------------
// Middleware
// ----------------------------------------------
app.use(express.json());

// ----------------------------------------------
// Get all tours
// ----------------------------------------------
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

// ----------------------------------------------
// Get a tour
// ----------------------------------------------
const getTour = (req, res) => {
  const tour = tours.find((tour) => tour.id === +req.params.id);

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
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
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
const updateTour = (req, res) => {
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
const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// ----------------------------------------------
// Routes
// ----------------------------------------------
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// ----------------------------------------------
// Start server
// ----------------------------------------------
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
