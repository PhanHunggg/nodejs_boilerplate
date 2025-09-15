const jwt = require("jsonwebtoken");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const UserRepository = require("../repository/user.repo");
const Token = require("../models/token.model");

/**
 * Middleware to authenticate JWT tokens
 */
const authentication = async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AuthFailureError("Authorization required"));
  }

  // Extract token
  const token = authHeader.split(" ")[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_AT_KEY || 'JWT_AT_KEY');
    
    // Check if token has been blacklisted
    const blacklistedToken = await Token.findOne({ token, type: 'access', blacklisted: true });
    if (blacklistedToken) {
      return next(new AuthFailureError("Token has been revoked"));
    }
    
    // Find user by ID or other identifier in token
    const user = await UserRepository.findUserByRefId(decoded.refId);
    
    if (!user) {
      return next(new NotFoundError("User not found"));
    }
    
    // Add user and token to request object for later use
    req.user = {
      id: user._id,
      username: user.username,
      name: user.name,
      refId: user.refId,
      balance: user.balance
    };
    
    // Store token in request for potential logout
    req.token = token;
    
    next();
  } catch (error) {
    return next(new AuthFailureError("Invalid token"));
  }
};

module.exports = { authentication };