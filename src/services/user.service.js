const UserRepository = require("../repository/user.repo");
const {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError
} = require("../core/error.response");
const jwt = require('jsonwebtoken');

class UserService {

  static async randomRefId() {
    let refId;
    // Generate random 7-digit numbers (1000000-9999999)
    let max = 9999999, min = 1000000;

    while (true) {
      // Generate 7 random digits
      let randomId = Math.floor(Math.random() * (max - min + 1)) + min;

      const findExistRandom = await UserRepository.findUserByRefId(randomId);
      if (!findExistRandom) {
        refId = randomId
        break;
      }
    }
    return refId;
  }
  /**
   * Create a pair of JWT tokens (access token and refresh token)
   * @param {Object} payload - Data to be included in the token
   * @returns {Object} - Object containing accessToken and refreshToken
   */
  static async createTokenPair(payload) {
    try {
      // Create access token
      const accessToken = jwt.sign(
        payload,
        process.env.JWT_AT_KEY || 'JWT_AT_KEY',
        { expiresIn: '2d' }
      );

      // Create refresh token
      const refreshToken = jwt.sign(
        payload,
        process.env.JWT_RT_KEY || 'JWT_RT_KEY',
        { expiresIn: '7d' }
      );

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error(`Token generation failed: ${error.message}`);
    }
  }
  /**
   * Register a new user
   * @param {Object} userData - User data for registration
   * @returns {Promise<Object>} - Object containing user data and JWT tokens
   * @throws {ConflictRequestError} If user already exists
   */
  static signup = async (userData) => {
    // Check if user exists by email or username
    const existingUserByUsername = await UserRepository.findUserByUsername(userData.username);

    const name = userData.name.toLowerCase().trim();
    const existingUserByName = await UserRepository.findUserByName(name);

    if (existingUserByUsername) {
      throw new ConflictRequestError("Username already exists");
    }

    if (existingUserByName) {
      throw new ConflictRequestError("Name already exists");
    }

     // Generate a unique referral ID
    const refId = await this.randomRefId();
    userData.refId = refId;
    // Create new user
    const newUser = await UserRepository.createUser(userData);

    // Generate token payload
    const tokenPayload = {
      name: newUser.name,
      refId: newUser.refId
    };

    // Generate JWT tokens
    const tokens = await this.createTokenPair(tokenPayload);

    // Return user data without password
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    return {
      user: userResponse,
      tokens
    };
  };

  /**
   * Login a user
   * @param {string} nameOrUsername - Name or username for login
   * @param {string} password - User password
   * @returns {Promise<Object>} - Object containing user data and JWT tokens
   * @throws {NotFoundError} If user not found
   * @throws {AuthFailureError} If password doesn't match
   */
  static login = async (name, password) => {
    // Find user with password (not lean() because we need the document methods)
    name = name.toLowerCase().trim();
    const user = await UserRepository.findUserByName(name);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Check if password matches
    const isPasswordMatch = await user.isPasswordMatch(password);

    if (!isPasswordMatch) {
      throw new AuthFailureError("Invalid password");
    }

    // Generate token payload
    const tokenPayload = {
      name: user.name,
      refId: user.refId
    };

    // Generate JWT tokens
    const tokens = await this.createTokenPair(tokenPayload);

    // Return user data without password
    const userResponse = user.toJSON();
    delete userResponse.password;

    return {
      user: userResponse,
      tokens
    };
  };
}

module.exports = UserService;
