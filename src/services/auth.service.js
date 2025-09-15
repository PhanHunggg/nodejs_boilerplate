const userModel = require('../models/user.model');
const {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError
} = require("../core/error.response");
const jwt = require('jsonwebtoken');
const moment = require('moment');
const AuthRepository = require('../repository/auth.repo');
const TokenService = require('./token.service');

class AuthService {
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

      // Save tokens to database
      const accessTokenExpires = moment().add(2, 'days').toDate();
      const refreshTokenExpires = moment().add(7, 'days').toDate();

      await TokenService.saveToken(accessToken, payload.id, accessTokenExpires, 'access');
      await TokenService.saveToken(refreshToken, payload.id, refreshTokenExpires, 'refresh');

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error(`Token generation failed: ${error.message}`);
    }
  }

  /**
   * Generate a unique referral ID for new users
   */
  static async generateRefId() {
    let refId;
    // Generate random 7-digit numbers (1000000-9999999)
    let max = 9999999, min = 1000000;

    while (true) {
      // Generate 7 random digits
      let randomId = Math.floor(Math.random() * (max - min + 1)) + min;

      // Convert to string to avoid ObjectId casting issues
      let randomIdStr = randomId.toString();

      // Check if this refId is already in use
      const findExistRandom = await AuthRepository.findUserByRefId(randomIdStr);

      if (!findExistRandom) {
        refId = randomIdStr;
        break;
      }
    }
    return refId;
  }

  /**
   * Register a new user
   * @param {Object} userData - User data for registration
   * @returns {Promise<Object>} - Object containing user data and JWT tokens
   * @throws {ConflictRequestError} If user already exists
   */
  static signup = async (userData) => {
    // Check if user exists by username
    const existingUserByUsername = await AuthRepository.findUserByUsername(userData.username);

    if (existingUserByUsername) {
      throw new ConflictRequestError("Username already exists");
    }

    // If email is provided, check if it exists
    if (userData.email) {
      const existingUserByEmail = await userModel.findOne({ email: userData.email });
      if (existingUserByEmail) {
        throw new ConflictRequestError("Email already exists");
      }
    }

    // Generate a unique referral ID
    const refId = await this.generateRefId();
    userData.refId = refId;

    userData.username = userData.username.trim();
    userData.displayName = userData.displayName.trim();

    // Create new user
    const newUser = await AuthRepository.createUser(userData);

    // Generate token payload
    const tokenPayload = {
      id: newUser._id,
      displayName: newUser.displayName,
      username: newUser.username,
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
   * @param {string} username - Username for login
   * @param {string} password - User password
   * @returns {Promise<Object>} - Object containing user data and JWT tokens
   * @throws {NotFoundError} If user not found
   * @throws {AuthFailureError} If password doesn't match
   */
  static login = async (username, password) => {
    // Find user with password
    username = username.trim();
    const user = await AuthRepository.findUserByUsername(username);

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
      id: user._id,
      displayName: user.displayName,
      username: user.username,
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

  /**
   * Verify a JWT token
   * @param {string} token - Token to verify
   * @param {string} secretKey - Secret key used to sign the token
   * @returns {Object} - Decoded token payload
   * @throws {AuthFailureError} If token is invalid
   */
  static verifyToken = async (token, secretKey = process.env.JWT_AT_KEY) => {
    try {
      return jwt.verify(token, secretKey);
    } catch (error) {
      throw new AuthFailureError('Invalid token');
    }
  };

  /**
   * Logout a user by blacklisting their tokens
   * @param {string} userId - User ID
   * @param {string} accessToken - Current access token
   * @param {string} refreshToken - Current refresh token (optional)
   * @returns {Promise<Object>} - Object indicating logout success
   */
  static logout = async (userId, accessToken, refreshToken = null) => {
    try {
      // Blacklist the access token
      await TokenService.blacklistToken(accessToken, userId, 'access');

      // If refresh token is provided, also blacklist it
      if (refreshToken) {
        await TokenService.blacklistToken(refreshToken, userId, 'refresh');
      }

      return { success: true, message: 'Logout successful' };
    } catch (error) {
      // Even if there's an error, we'll return success 
      // as per requirements (if token is invalid, it's effectively "logged out")
      return { success: true, message: 'Logout successful' };
    }
  };
}

module.exports = AuthService;