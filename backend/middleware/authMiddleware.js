const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const authenticate = (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.jwt;

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};