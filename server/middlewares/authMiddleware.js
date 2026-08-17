const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Header checking for Bearer Token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token string from "Bearer <TOKEN>"
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach Dealer profile object to request (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found with this token');
      }

      next(); // Pass control to the next controller
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed or expired');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};
module.exports = { protect,admin };