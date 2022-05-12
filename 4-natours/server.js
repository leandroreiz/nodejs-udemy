// ----------------------------------------------
// Server
// ----------------------------------------------
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// Require app after dotenv
const app = require('./app');

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
  console.log(err.name, err.message);
  console.log('Unhandled rejection! Shutting down...');

  server.close(() => {
    process.exit(1);
  });
});
