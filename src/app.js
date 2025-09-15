"use strict";
require("dotenv").config();
const express = require("express");
const compression = require("compression");
const { default: helmet } = require("helmet");
const cors = require('cors');
const router = require("./routes/api");
const swagger = require('./configs/swagger/swagger');
const morgan = require('./configs/morgan');
const config = require("./configs/config");
const mongoSanitize = require('express-mongo-sanitize');
const { authLimiter } = require('./middlewares/rateLimiter');
const ApiError = require('./utils/ApiError');
const httpStatus = require('http-status');
const { errorConverter, errorHandler } = require("./utils/error");

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}
// set security HTTP headers
app.use(helmet());
// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("."));

// sanitize request data
app.use(mongoSanitize());

// gzip compression
app.use(compression());
app.disable("x-powered-by");

// enable cors
app.use(cors());
app.options('*', cors());
//init dbs
require("./dbs/init.mongodb");

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// Swagger API Documentation
app.use('/api-docs', swagger.serve, swagger.setup);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/api/auth', authLimiter);
}
//init routes
app.use("/api", router)
// handling error
// Catch 404 errors

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
