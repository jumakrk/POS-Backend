const createError = require('http-errors');

module.exports = (req, res, next) => {
  // Check if the user is authenticated and is an admin
if (!req.user || req.user.role !== 'admin') {
    return next(createError.Unauthorized('Only admins can perform this action.'));
}
  // If user is admin, proceed to the next middleware or route handler
next();
};