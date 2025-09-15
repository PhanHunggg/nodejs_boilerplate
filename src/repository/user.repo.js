const userModel = require("../models/user.model");

class UserRepository {
  /**
   * Find a user by email
   * @param {string} email - The email to search for
   * @returns {Promise<Object>} - The found user or null
   */
  static async findUserByEmail(email) {
    return userModel.findOne({ email }).lean();
  }

  /**
   * Find a user by username
   * @param {string} username - The username to search for
   * @returns {Promise<Object>} - The found user or null
   */
  static async findUserByUsername(username) {
    return userModel.findOne({ username }).lean();
  }

  /**
   * Find a user by name
   * @param {string} name - The name to search for
   * @returns {Promise<Object>} - The found user or null
   */
  static async findUserByName(name) {
    return userModel.findOne({ name }).lean();
  }

    /**
   * Find a user by name
   * @param {string} name - The name to search for
   * @returns {Promise<Object>} - The found user or null
   */
  static async findUserByRefId(refId) {
    return userModel.findOne({ refId }).lean();
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
   * Find a user by email or username with password for authentication
   * @param {string} emailOrUsername - The email or username to search for
   * @returns {Promise<Object>} - The found user (with password) or null
   */
  static async findUserForAuth(emailOrUsername) {
    return userModel.findOne({
      $or: [
        { name: emailOrUsername },
        { username: emailOrUsername }
      ]
    });
  }
}

module.exports = UserRepository;
