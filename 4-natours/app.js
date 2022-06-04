// ----------------------------------------------
// NATOURS APP
// Ver.: 2.0.0
// Original Design: Jonas Schmedtmann
// Coded by Leandro Reis
// ----------------------------------------------

// ----------------------------------------------
// Imports
// ----------------------------------------------

import hpp from 'hpp';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import express from 'express';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import AppError from './utils/appError.js';
import viewRouter from './routes/viewRoutes.js';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import globalErrorHandler from './controllers/errorController.js';

const app = express();

// ----------------------------------------------
// Set up __dirname
// ----------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------------------------------
// PUG engine setup
// ----------------------------------------------

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ----------------------------------------------
// Global Middlewares
// ----------------------------------------------

// CORS policy
app.use(
  cors({
    origin: 'http://localhost:8000',
    credentials: true,
  })
);

// Further HELMET configuration for Content Security Policy (CSP)
// Source: https://github.com/helmetjs/helmet
const scriptSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://cdnjs.cloudflare.com/ajax/libs/axios/1.0.0-alpha.1/axios.min.js',
];

const styleSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://fonts.googleapis.com/',
];

const connectSrcUrls = [
  'https://unpkg.com',
  'https://tile.openstreetmap.org',
  'https://cdnjs.cloudflare.com/ajax/libs/axios/1.0.0-alpha.1/axios.min.js',
  'http://localhost:8000/api/v1/users/login',
];

const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: ["'self'", ...scriptSrcUrls],
      connectSrc: ["'self'", ...connectSrcUrls],
      fontSrc: ["'self'", ...fontSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
      workerSrc: ["'self'", 'blob:'],
    },
  })
);

// Serving static files (works closely with PUG)
app.use(express.static(path.join(__dirname, 'public')));

// Http request logger for development environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Too many consecutive requests were attempted! Please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against noSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS (using HTML injection)
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// TEST MIDDLEWARE ------------------------------
// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });
// END TEST -------------------------------------

// ----------------------------------------------
// Routes
// ----------------------------------------------

// Views routes
app.use('/', viewRouter);

// API routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Dealing with unknown urls
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
