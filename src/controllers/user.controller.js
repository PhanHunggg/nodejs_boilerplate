const UserService = require("../services/user.service");
const { CREATED, SUCCESS } = require("../core/success.response");
const { 
  BadRequestError, 
  ConflictRequestError, 
  AuthFailureError,
  InternalServerError 
} = require("../core/error.response");

class UserController {
  /**
   * Register a new user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static signup = async (req, res, next) => {
    try {
      const { username, name, password } = req.body;
      
      // Validate required fields
      if (!username || !name || !password) {
        throw new BadRequestError("Missing required fields");
      }

      // Service will throw appropriate errors if needed
      const result = await UserService.signup(req.body);

      // Return success response
      return new CREATED({
        message: "User created successfully",
        metaData: result
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login a user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static login = async (req, res, next) => {
    try {
      const { name, password } = req.body;

      // Validate required fields
      if (!name || !password) {
        throw new BadRequestError("Missing name or password");
      }

      // Service will throw appropriate errors if needed
      const result = await UserService.login(name, password);

      // Return success response
      return new SUCCESS({
        message: "Login successful",
        metaData: result
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;
