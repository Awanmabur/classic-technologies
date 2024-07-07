const express = require('express');
const router = express.Router();
const moment = require('moment');
const path = require('path');
const fs = require("fs")
const Review = require('../models/review');
const User = require("../models/User");

// ***index route***
exports.index = async (req, res, next) => {
  try {
      const userId = req.user;
      const user = await User.findById(userId);
      const review = await Review.find({});
      res.render('./reviews/main-page', { review, user });
  } catch (error) {
    req.flash('error', 'There is problem getting review, please try again.');
    return res.redirect('/');
  }
};


// ***create report route***
exports.create = async (req, res, next) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);
    res.render('./reviews/create', { user });
  } catch (error) {
    req.flash('error', 'There is problem getting page, please try again.');
    return res.redirect('/');
  }
};


// ***store report route***
exports.store = async (req, res, next) => {
  const { username, title, review } = req.body;

  const ownerToken = req.cookies.userToken;

  let image;
  if (req.file) {
    image = req.file.filename;
  }

try {

  if (req.fileValidationError) {
    return res.status(400).json({ error: req.fileValidationError });
  }
  // Check the size of the uploaded image
  if (req.file.size > 2 * 1024 * 1024) {
    fs.unlinkSync(req.file.path);
    req.flash('error', 'Image size exceeds the limit (2MB).');
    return res.redirect('/create-review');
  }
  // Check if the image with the same filename exists in the database
  const existingImage = await Review.findOne({ image:image });

  if (existingImage) {
    req.flash('error', 'Image already exists in the database');
    return res.redirect('/create-review');
  } else {
    // If the image doesn't exist, save it to the database
    const newReview = new Review({ username, ownerToken, title, image, review });

    await newReview.save();
    req.flash('success', 'You have successfully created your review Thanks.');
    res.redirect('/');
}
  } catch (error) {
    req.flash('error', 'There is problem posting review, please try again later.');
    res.redirect('/');
  }
};


// ***edit report route***
exports.edit = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user;
  const user = await User.findById(userId);
  const review = await Review.findOne({ _id: id });
  res.render("./reviews/edit", { review, user });
};


// ***edit update route***
exports.update = async (req, res, next) => {
try {
  const { id } = req.params;
  const { username, title, review } = req.body;
  // Check if an image was uploaded
  let imageUrl;
  if (req.file) {
    imageUrl = req.file.filename;
  }

  if (req.fileValidationError) {
    return res.status(400).json({ error: req.fileValidationError });
  }
  // Check the size of the uploaded image
  if (imageUrl && req.file.size > 2 * 1024 * 1024) {
    fs.unlinkSync(req.file.path);
    req.flash('error', 'Image size exceeds the limit (2MB).');
    return res.redirect('/review');
  }
  // Check if the image with the same filename exists in the database
  const existingImage = await Review.findOne({ image: imageUrl });

  if (existingImage) {
    req.flash('error', 'Image already exists in the database');
    return res.redirect('/review');
  } else {
  // Find the existing blog post by ID
  const existingPost = await Review.findById({ _id: id });
        if (!existingPost) {
          req.flash('error', 'This post is not available')
          return res.redirect('/review');
        }

  // Delete the old image if a new image was uploaded
  if (imageUrl && existingPost.image) {
    const imagePath = path.join(__dirname, '../public/uploads', existingPost.image);
    fs.unlinkSync(imagePath); // Delete the old image file
  }

  // Update the blog post with the new data
  existingPost.username = username;
  existingPost.title = title;
  existingPost.review = review;
  existingPost.image = imageUrl || existingPost.image; // Use the new image URL or keep the existing one

  // Save the updated blog post
  await existingPost.save();
  req.flash('success', 'You have successfully updated the review.');
  res.redirect('/'); // Redirect to the updated blog post page
  }
} catch (error) {
  req.flash('error', 'there is problem updating your post');
  return res.redirect('/review');
}
};


// ***route to show more ***
exports.show = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user;
  const user = await User.findById(userId);
  const review = await Review.findOne({ _id: id });
  res.render("./reviews/moreabout", { review, user, userToken: req.cookies.userToken });
};


// ***route to show more ***
exports.reviewsAdmin = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user;
  const user = await User.findById(userId);
  const review = await Review.findOne({ _id: id });
  res.render("./admin/moreabout1", { review, user });
};


// ***route for deleting image and associated text ***
exports.destroy = async (req, res, next) => {
  const postId = req.params.postId;

  Review.findById(postId, (err, post) => {
    if (err || !post) {
      req.flash('error', 'This post is not available')
      return res.redirect('/review');
    }

    // Delete image from uploads folder
    const imagePath = path.join(__dirname, '../public/uploads', post.image);
    fs.unlinkSync(imagePath);

    // Delete the post from the database
    Review.findByIdAndRemove(postId, (err) => {
      if (err) {
        req.flash('error', 'there is problem deleting your review');
        return res.redirect('/review');
      }
      req.flash('success', 'You have successfully deleted your review.');
      res.redirect('/'); // Redirect to the updated blog post page
    });
  });
};
