const jwt = require('jsonwebtoken');
const jwtSecret = process.env.PRIVATE_KEY;
const User = require("../models/User");

exports.user = (req, res, next) => {
  const token = req.session.token;
  if (token) {
    jwt.verify(token, 'jwtSecret', (err, decodedToken) => {
      if (err) {
        req.flash('error', 'Invalid token Please log in again');
        res.redirect('/login');
      } else {
        req.user = decodedToken.userId;
        next();
      }
    });
  } else {
    req.flash('error', 'Please log in first to do that thing');
    res.redirect('/login');
  }
};
