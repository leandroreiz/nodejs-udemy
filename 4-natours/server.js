// ----------------------------------------------
// Server
// ----------------------------------------------

import mongoose from 'mongoose';
import { config } from 'dotenv';

// ----------------------------------------------
// Uncaught exception
// ----------------------------------------------

process.on('uncaughtException', err => {
  console.log('Uncaught exception! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

config({ path: './config.env' });

// Require app after dotenv
import app from './app.js';

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// ----------------------------------------------
// Database connection
// ----------------------------------------------

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connected!'));

// ----------------------------------------------
// Server connection
// ----------------------------------------------

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// ----------------------------------------------
// Unhandled rejection events
// ----------------------------------------------

process.on('unhandledRejection', err => {
  console.log('Unhandled rejection! Shutting down...');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

// ----------------------------------------------
// SIGTERM signal sent through Heroku
// ----------------------------------------------

process.on('SIGTERM', () => {
  console.log('🟡 SIGTERM RECEIVED. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated!');
  });
});
