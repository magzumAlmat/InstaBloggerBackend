const passport = require('passport');

exports.authenticateJWT = passport.authenticate('jwt', { session: false });

exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden. Required role: ' + role });
    }
    next();
  };
};
