const userModel = require("../models/user.model");

class AuthRepository {
  /**
   * Find a user by name
   * @param {string} name - The name to search for
   * @returns {Promise<Object>} - The found user or null
   */
  static async findUserByName(name) {
    return userModel.findOne({ name }).select('+password');
  }


  static async findUserByRefId(refId) {
    return userModel.findOne({ refId }).select('-password');
  }

  /**
   * Find a user by username
   * @param {string} username - The username to search for
   * @returns {Promise<Object>} - The found user or null
   */
  static async findUserByUsername(username) {
    return userModel.findOne({ username }).select('+password');
  }

  /**
   * Create a new user
   * @param {Object} userData - User data to create
   * @returns {Promise<Object>} - The created user
   */
  static async createUser(userData) {
    return userModel.create(userData);
  }

  /**
   * Find a user by ID
   * @param {string} userId - The user ID to search for
   * @returns {Promise<Object>} - The found user or null
   */
  static async findUserById(userId) {
    return userModel.findById(userId);
  }
}

module.exports = AuthRepository;