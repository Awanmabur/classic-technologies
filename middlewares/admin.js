const jwt = require('jsonwebtoken');
const jwtSecret = process.env.PRIVATE_KEY;
const User = require("../models/User");

exports.admin = (req, res, next) => {
  const token = req.session.token;
  jwt.verify(token, 'jwtSecret', (err, decodedToken) => {
    if (err) {
      req.flash('error', 'Dear user, please do the right thing or else you will be suspend.');
      return res.redirect('/signup');
    } if (decodedToken.role !== 'super-admin') {
      req.flash('warning', 'Dear user, Please do the right thing.');
      return res.redirect('/login');
    }
    next();
  });
};
