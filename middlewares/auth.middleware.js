const passport = require('passport');

exports.authenticateJWT = passport.authenticate('jwt', { session: false });

exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || req.user.role.toUpperCase() !== role.toUpperCase()) {
      return res.status(403).json({ message: 'Forbidden. Required role: ' + role });
    }
    next();
  };
};
