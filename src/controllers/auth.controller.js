const AuthService = require("../services/auth.service");
const { CREATED, SUCCESS } = require("../core/success.response");
const { 
  BadRequestError
} = require("../core/error.response");

class AuthController {
  /**
   * Register a new user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static signup = async (req, res, next) => {
    try {
      const { username, displayName, password } = req.body;
      
      // Validate required fields
      if (!username || !displayName || !password) {
        throw new BadRequestError("Missing required fields");
      }

      // Service will throw appropriate errors if needed
      const result = await AuthService.signup(req.body);

      // Return success response
      return new CREATED({
        message: "User registered successfully",
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
      const { username, password } = req.body;

      // Validate required fields
      if (!username || !password) {
        throw new BadRequestError("Missing username or password");
      }

      // Service will throw appropriate errors if needed
      const result = await AuthService.login(username, password);

      // Return success response
      return new SUCCESS({
        message: "Login successful",
        metaData: result
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Logout a user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static logout = async (req, res, next) => {
    try {
      // Get the user ID and token from the request (set by authentication middleware)
      const userId = req.user.id;
      const accessToken = req.token;
      
      // Call the logout service
      await AuthService.logout(userId, accessToken);
      
      // Return success response
      return new SUCCESS({
        message: "Logout successful",
        metaData: { success: true }
      }).send(res);
    } catch (error) {
      // Even if there's an error, we return success as per requirements
      return new SUCCESS({
        message: "Logout successful",
        metaData: { success: true }
      }).send(res);
    }
  };
}

module.exports = AuthController;