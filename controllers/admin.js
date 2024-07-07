const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const moment = require('moment');
const jwtSecret = process.env.PRIVATE_KEY;
const Review = require('../models/review');
const BlogPost = require('../models/BlogPost');


// ***index route***
exports.users = async (req, res, next) => {
  try {

    const blog = await BlogPost.find({});
    const review = await Review.find({});
    const users = await User.find();
    const token = req.session.token;
    if (!token) {
      req.flash('error', 'Token expired. Please log in again.');
      return res.redirect('/login');
    }
    // Verify JWT token
    const decodedToken = jwt.verify(token, 'jwtSecret');
    // find the user using userId associated with token
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      req.flash('error', 'sorry we do not have this user in our database');
      return res.redirect('/signup&login');
    }

    res.render('admin/users', { user, blog, review, moment,  users, });
  } catch (error) {
    req.flash('warning', 'There is problem while getting users.');
    res.redirect('/');
  }
};


 // ***deleteUser route***
exports.deleteUser = async (req, res, next) => {
  const { userId } = req.body;
  const token = req.session.token;
  if (!token) {
    req.flash('error', 'Please do the right thing.');
    return res.redirect('/signup&login');
  }
  // Verify JWT token
  const decodedToken = jwt.verify(token, 'jwtSecret');
  if (decodedToken.role !== 'super-admin') {
    req.flash('warning', 'Dear user, Please do the right thing.');
    return res.redirect('/signup&login');
  }
  // Find the user by ID
  User.findById(userId, (err, user) => {
    if (err) {
      req.flash('error', 'There is problem somewhere.');
      res.redirect('/users');
    } if (!user) {
      req.flash('error', 'user is no longer exist.');
      res.redirect('/users');
    }
    // Check if user role is admin
    if (user.role !== 'super-admin') {
      // User is not an admin, allow deletion
      User.findByIdAndDelete(userId, (err) => {
        if (err) {
          req.flash('error', 'There is problem somewhere.');
          res.redirect('/users');
        }
        req.flash('success', 'You have successfully Deleted one user.');
        res.redirect('/users');
      });
    } else {
      req.flash('warning', "Dear user, you jok too much infact you want to play with your father's testlces, admin is the boss and you cannot Delete him😂😂😂");
      res.redirect('/users');
    }
  });
};


 // ***suspend User route***
exports.suspendUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (user.role === 'super-admin') {
      req.flash('warning', "Dear user, you jok too much infact you want to play with your father's testilces, admin is the boss and you cannot suspend him😂😂😂");
      return res.redirect('/users');
    }

    user.isSuspended = true;
    await user.save();
    req.flash('success', 'You have successfully Suspended one user.');
    res.redirect('/users');
  } catch (error) {
    req.flash('warning', 'You have failed Suspending the user.');
    res.redirect('/users');
  }
};


 // ***unsuspendUser route***
exports.unsuspendUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    user.isSuspended = false;
    await user.save();
    req.flash('success', 'You have successfully Unsuspended one user.');
    res.redirect('/users');
  } catch (error) {
    req.flash('warning', 'You have failed Unsuspending the user.');
    res.redirect('/users');
  }
};


// ***suspend User route***
exports.isVerified = async (req, res, next) => {
 try {
   const { userId } = req.body;
   const user = await User.findById(userId);

   if (user.role === 'super-admin') {
     req.flash('warning', "Dear user, admin is the boss and he is naturally Verified thank for your effort😂😂😂");
     return res.redirect('/users');
   }

   user.isVerified = true;
   await user.save();
   req.flash('success', 'You have successfully Verified one user.');
   res.redirect('/users');
 } catch (error) {
   req.flash('warning', 'You have failed Verifying the user.');
   res.redirect('/users');
 }
};
