const express = require("express");
const AuthController = require("../../controllers/auth.controller");
const validate = require("../../middlewares/validate");
const { userValidation } = require("../../validations");

const router = express.Router();

// Auth routes
router.post("/register", validate(userValidation.signup), AuthController.signup);
router.post("/login", validate(userValidation.login), AuthController.login);

module.exports = router;