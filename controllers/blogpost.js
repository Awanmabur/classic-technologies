const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require("fs")

const jwt = require('jsonwebtoken');
const moment = require('moment');
const BlogPost = require('../models/BlogPost');
const User = require('../models/User');
const {user} = require("../middlewares/auth");

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
 

// ***index route***
exports.index = async (req, res, next) => {
  try {
      const userId = req.user;
      const user = await User.findById(userId);
      const blog = await BlogPost.find({});
      res.render('./blogPost/index', { blog, user });
  } catch (error) {
    req.flash('error', 'There is problem getting about you, please try again.');
    return res.redirect('/');
  }
};


// ***create report route***
exports.create = async (req, res, next) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);
    res.render('./blogPost/create', {user});
  } catch (error) {
    req.flash('error', 'There is problem getting your blogs, please try again.');
    return res.redirect('/');
  }
};


// ***store report route***
exports.store = async (req, res, next) => {
  const { title, content } = req.body;

  let image;
  if (req.file) {
    image = req.file.filename;
  }

  const token = req.session.token;
  if (!token) {
    req.flash('error', 'Your token has expired please login again.');
    return res.redirect('/signup&login');
  }
  // Verify JWT token
  const decodedToken = jwt.verify(token, 'jwtSecret');
  const userId = decodedToken.userId;
  // Get user and account details
  const user = await User.findById(userId);

  const owner = req.user


try {

  if (req.fileValidationError) {
    return res.status(400).json({ error: req.fileValidationError });
  }
  // Check the size of the uploaded image
  if (req.file.size > 2 * 1024 * 1024) {
    fs.unlinkSync(req.file.path);
    req.flash('error', 'Image size exceeds the limit (2MB).');
    return res.redirect('/create-blogPost');
  }
  // Check if the image with the same filename exists in the database
  const existingImage = await BlogPost.findOne({ image:req.file.filename });

  if (existingImage) {
    req.flash('error', 'Image already exists in the database');
    return res.redirect('/create-blogPost');
  } else {

    const subscribers = await Subscriber.find({});
    const emails = subscribers.map(subscriber => subscriber.email);

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: emails,
      subject: title,
      text: content,
      file: image
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        req.flash('error', 'There is problem posting blog, please try again later.');
        res.redirect('/profile');
      } else {
        // If the image doesn't exist, save it to the database
        const blogPost = new BlogPost({ user:userId, owner, image, title, content });
        user.BlogPosts.push(blogPost);
        // save report
        await Promise.all([blogPost.save(), user.save()]);
        req.flash('success', 'You have successfully created your blog post.');
        res.redirect('/profile');
      }
    })
}
  } catch (error) {
    req.flash('error', 'There is problem posting blog, please try again later.');
    res.redirect('/profile');
  }
};


// ***edit report route***
exports.edit = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user;
  const user = await User.findById(userId);
  const blog = await BlogPost.findOne({ _id: id });
  res.render("./blogPost/edit", { blog, user });
};


// ***edit update route***
exports.update = async (req, res, next) => {
try {
  const { id } = req.params;
  const { title, Category, content } = req.body;
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
    return res.redirect('/profile');
  }
  // Check if the image with the same filename exists in the database
  const existingImage = await BlogPost.findOne({ image: imageUrl });

  if (existingImage) {
    req.flash('error', 'Image already exists in the database');
    return res.redirect('/profile');
  } else {
  // Find the existing blog post by ID
  const existingPost = await BlogPost.findById({ _id: id });
        if (!existingPost) {
          req.flash('error', 'This post is not available')
          return res.redirect('/profile');
        }

  // Delete the old image if a new image was uploaded
  if (imageUrl && existingPost.image) {
    const imagePath = path.join(__dirname, '../public/uploads', existingPost.image);
    fs.unlinkSync(imagePath); // Delete the old image file
  }

  // Update the blog post with the new data
  existingPost.title = title;
  existingPost.content = content;
  existingPost.image = imageUrl || existingPost.image; // Use the new image URL or keep the existing one

  // Save the updated blog post
  await existingPost.save();
  req.flash('success', 'You have successfully updated one blog post.');
  res.redirect('/profile');
  }
} catch (error) {
  req.flash('error', 'there is problem updating your post');
  return res.redirect('/Blogpost');
}
};


// ***route to show more ***
exports.show = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user;
  const user = await User.findById(userId);
  const blog = await BlogPost.findOne({ _id: id });
  res.render("./blogPost/moreabout", { blog, userId, user });
};


exports.blogpostAdmin = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user;
  const user = await User.findById(userId);
  const blog = await BlogPost.findOne({ _id: id });
  res.render("./admin/moreabout", { blog, userId, user });
};

// ***route for deleting image and associated text ***
exports.destroy = async (req, res, next) => {
  const postId = req.params.postId;
  const blog = await BlogPost.findById(postId);


  BlogPost.findById(postId, (err, post) => {
    if (err || !post) {
      req.flash('error', 'Post not found.');
      return res.redirect('/blogPost');
    }

    // if (postId) {
    //     // Check and delete images if they exist
    //     if (blog.image) {
    //         fs.unlinkSync(path.join(__dirname, '../public/uploads', blog.image));
    //     }
    //   }

    // // Delete image from uploads folder
    // const imagePath = path.join(__dirname, '../public/uploads', post.image);
    // fs.unlinkSync(imagePath);

    // Delete the post from the database
    BlogPost.findByIdAndRemove(postId, (err) => {
      if (err) {
        req.flash('error', 'There is Error deleting this post.');
        return res.redirect('/Blogpost');
      }
      req.flash('success', 'You have successfully deteted one post');
      res.redirect('/Blogpost');
    });
  });
};
