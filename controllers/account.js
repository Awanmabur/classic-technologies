const express = require('express');
const router = express.Router();
const moment = require('moment');
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const path = require('path');
const fs = require("fs")

const jwtSecret = process.env.PRIVATE_KEY;
const BlogPost = require('../models/BlogPost');
const Review = require('../models/review');
const Subscriber = require('../models/subscribers');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

// ***transporter***
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});


exports.subscribe = async (req, res, next) => {
  const { email } = req.body;
  try {
    const existingEmail = await Subscriber.findOne({ email });

    if (existingEmail) {
      req.flash('error', 'email already exists in the database');
      return res.redirect('/');
  } else {
    const subscriber = new Subscriber({ email });
    await subscriber.save();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Thank you for subscribing to our newsletter.',
      text: 'You have successfully subscribed to our newsletter, stay tuned for any tech update or business blogs.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        req.flash('error', 'there is problem some where please try again later');
        return res.redirect('/');
      } else {
        req.flash('success', 'You have successfully subscribe to our newsletter thanks.');
        res.redirect('/');
      }
    });

    }
  } catch (error) {
    req.flash('error', 'there is problem some where please try again later');
    return res.redirect('/');
  }
};


// ***index route***
exports.index = async (req, res, next) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);
    const oneUser = await User.find({image: user.image});

    // const user = await User.findOne({ user:req.user });
    const blog = await BlogPost.find({});
    const ownerBlog = await BlogPost.find({user:req.user});
    const review = await Review.find({});
    const allBlogs = blog.length;
    const allReviews = review.length;
    const myBlogs = await BlogPost.countDocuments({user:req.user});

    res.render('account/dashboard', { user, oneUser, myBlogs, allBlogs, allReviews, ownerBlog, blog, userId, review });
  } catch (error) {
    req.flash('error', 'There is problem getting your dashboard, please try again.');
    return res.redirect('/');
  }
};



// ***edit report route***
exports.edit = async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id });
  const oneUser = await User.find({image: user.image});
  res.render("./account/edit", { user, oneUser });
};


// ***edit update route***
exports.update = async (req, res, next) => {
try {
  const { id } = req.params;
  const { bios, fname, lname } = req.body;
  // Check if an image was uploaded
  let imageUrl;
  if (req.file) {
    imageUrl = req.file.filename;
  }

  if (req.fileValidationError) {
    return res.status(400).json({ error: req.fileValidationError });
  }
  // Check the size of the uploaded image
  if (imageUrl && req.file.size > 5 * 1024 * 1024) {
    fs.unlinkSync(req.file.path);
    req.flash('error', 'Image size exceeds the limit (2MB).');
    return res.redirect('/profile');
  }

  // Find the existing blog post by ID
  const existingPost = await User.findById({ _id: id });
        if (!existingPost) {
          req.flash('error', 'This post is not available')
          return res.redirect('/profile');
        }

  // // Delete the old image if a new image was uploaded
  // if (imageUrl && existingPost.image) {
  //   const imagePath = path.join(__dirname, '../public/uploads', existingPost.image);
  //   fs.unlinkSync(imagePath); // Delete the old image file
  // }

  // Update the blog post with the new data
  existingPost.bios = bios;
  existingPost.fname = fname;
  existingPost.lname = lname;
  existingPost.image = imageUrl || existingPost.image; // Use the new image URL or keep the existing one

  // Save the updated blog post
  await existingPost.save();
  req.flash('success', 'You have successfully updated your profile.');
  res.redirect('/profile');

} catch (error) {
  req.flash('error', 'there is problem updating your post');
  return res.redirect('/profile');
}
};
