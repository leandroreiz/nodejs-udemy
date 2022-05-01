// ----------------------------------------------
// NATOURS APP
// Ver.: 1.0.0
// Design: Jonas Schmedtmann
// Coded by Leandro Reis
// ----------------------------------------------
// Imports
// ----------------------------------------------
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

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
// Http request logger
app.use(morgan('dev'));

// Provide request body parsing
app.use(express.json());

// Test only
app.use((req, res, next) => {
  console.log('Hello from the middleware 🤓');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ----------------------------------------------
// Controllers
// ----------------------------------------------

// ----------------------------------------------
// Get all tours
// ----------------------------------------------
const getAllTours = (req, res) => {
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
const getTour = (req, res) => {
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
const createTour = (req, res) => {
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
// User handlers
// ----------------------------------------------
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// ----------------------------------------------
// Routes
// ----------------------------------------------

const tourRouter = express.Router();
app.use('/api/v1/tours', tourRouter);
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

const userRouter = express.Router();
app.use('/api/v1/users', userRouter);
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// ----------------------------------------------
// Start server
// ----------------------------------------------
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
