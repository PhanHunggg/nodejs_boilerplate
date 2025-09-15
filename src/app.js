"use strict";
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const { default: helmet } = require("helmet");
const cors = require('cors');
const router = require("./routes/api");
const swagger = require('./configs/swagger/swagger');

const app = express();

// set security HTTP headers
app.use(helmet());
// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("."));
app.use(morgan("dev"));

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

//init routes
app.use("/api", router)
// handling error
// Catch 404 errors

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    const message = error.message || 'Internal Server Error';

    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : {}
    });
});

module.exports = app;
