const jwt = require('jsonwebtoken');
const moment = require('moment');
const Token = require('../models/token.model');
const { AuthFailureError } = require('../core/error.response');

class TokenService {
  /**
   * Save a token
   * @param {string} token
   * @param {string} userId
   * @param {Date} expires
   * @param {string} type
   * @param {boolean} [blacklisted=false]
   * @returns {Promise<Token>}
   */
  static async saveToken(token, userId, expires, type, blacklisted = false) {
    const tokenDoc = await Token.create({
      token,
      user: userId,
      expires,
      type,
      blacklisted,
    });
    return tokenDoc;
  }

  /**
   * Verify token and return token payload if valid
   * @param {string} token
   * @param {string} type - Type of token (access, refresh, etc.)
   * @returns {Promise<Object>}
   */
  static async verifyToken(token, type) {
    try {
      const payload = jwt.verify(token, type === 'access' ? process.env.JWT_AT_KEY || 'JWT_AT_KEY' : process.env.JWT_RT_KEY || 'JWT_RT_KEY');
      
      // Check if token has been blacklisted
      const tokenDoc = await Token.findOne({ token, type, blacklisted: true });
      if (tokenDoc) {
        throw new AuthFailureError('Token has been revoked');
      }
      
      return payload;
    } catch (error) {
      throw new AuthFailureError('Invalid or expired token');
    }
  }

  /**
   * Blacklist a token
   * @param {string} token
   * @param {string} type - Type of token (access, refresh, etc.)
   * @returns {Promise<Token>}
   */
  static async blacklistToken(token, userId, type) {
    try {
      const payload = jwt.verify(token, type === 'access' ? process.env.JWT_AT_KEY || 'JWT_AT_KEY' : process.env.JWT_RT_KEY || 'JWT_RT_KEY');
      
      // Calculate token expiry time
      const tokenExpires = moment.unix(payload.exp).toDate();
      
      // Check if token already exists in database
      const existingToken = await Token.findOne({ token, type });
      
      if (existingToken) {
        // Update existing token to blacklisted
        existingToken.blacklisted = true;
        await existingToken.save();
        return existingToken;
      }
      
      // Create a new blacklisted token entry
      return this.saveToken(token, userId, tokenExpires, type, true);
    } catch (error) {
      // If token is invalid, we don't need to blacklist it
      if (error instanceof jwt.JsonWebTokenError) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Find token
   * @param {string} token
   * @param {string} type
   * @param {boolean} [blacklisted=false]
   * @returns {Promise<Token>}
   */
  static async findToken(token, type, blacklisted = false) {
    return Token.findOne({ token, type, blacklisted });
  }
}

module.exports = TokenService;