const express = require("express");
const path = require("path");
const router = require("express").Router();
const BlogPost = require('../models/BlogPost');
const Review = require('../models/review');
const User = require('../models/User');
const {checkLoginStatus} = require("../middlewares/loginStatus");


router.get('/', checkLoginStatus, async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId);

  const blog = await BlogPost.find({}).limit(3);;
  const review = await Review.find({});
  res.render("./home/index", { blog, user, review });
});


router.get('/ads.txt', async (req, res) => {
  res.render("./home/Ads");
});

router.get('/contact', checkLoginStatus, async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId);

  res.render("./home/contact", { user });
});

router.get('/top-management', checkLoginStatus, async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId);

  res.render("./home/top-management", { user });
});

router.get('/services', checkLoginStatus, async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId);

  res.render("./home/services", { user });
});

router.get('/privacy-policy', checkLoginStatus, async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId);

  res.render("./home/privacy-policy", { user });
});

router.get('/partners', checkLoginStatus, async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId);

  res.render("./home/partner", { user });
});

router.get('/about', checkLoginStatus, async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId);

  res.render("./home/about", { user });
});

router.get('/team', checkLoginStatus, async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId);

  res.render("./home/team", { user });
});


module.exports = router;
