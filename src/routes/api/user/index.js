const express = require("express");
const UserController = require("../../../controllers/user.controller");
const validate = require('../../../middlewares/validate');
const { userValidation } = require("../../../validations");

const user = express.Router();

// User registration endpoint
user.post("/register", validate(userValidation.signup), UserController.signup);

// User login endpoint
user.post("/login", validate(userValidation.login), UserController.login);

// Keep the old endpoint for backward compatibility

module.exports = user;
