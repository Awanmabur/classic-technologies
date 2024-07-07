const jwt = require('jsonwebtoken');
const jwtSecret = process.env.PRIVATE_KEY;
const User = require("../models/User");

exports.requireLogin = (req, res, next) => {
  const token = req.session.token;
  if (!token) {
    req.flash('error', 'You need to log in first to access your the system.');
    res.redirect('/login');
  } else {
    jwt.verify(token, 'jwtSecret', (err, decodedToken) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          req.flash('error', 'Token expired. Please log in again.');
        } else {
          req.flash('error', 'Token verification failed. Please log in again.');
        }
        res.redirect('/login');
      } else {
        req.user = decodedToken.userId;
        next();
      }
    });
  }
};
