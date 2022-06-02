import { readFileSync } from 'fs';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import { create, deleteMany } from '../../models/tourModel';
import {
  create as _create,
  deleteMany as _deleteMany,
} from '../../models/userModel';
import {
  create as __create,
  deleteMany as __deleteMany,
} from '../../models/reviewModel';

config({ path: './config.env' });

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read json file
const tours = JSON.parse(readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// Import data into database

const importData = async () => {
  try {
    await create(tours);
    await _create(users, { validateBeforeSave: false });
    await __create(reviews);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

// Delete all data from collection
const deleteData = async () => {
  try {
    await deleteMany();
    await _deleteMany();
    await __deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
}

if (process.argv[2] === '--delete') {
  deleteData();
}
