require("dotenv").config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const jwtSecret = process.env.PRIVATE_KEY


//calling the middlewares
const {user} = require("../middlewares/auth");

const users = require("../controllers/users");

router.get('/signup', (req, res) => res.render("users/signup"));

router.get('/login', users.getLogin);

router.post('/register', users.register);

router.post('/login', users.login );

router.get('/forgotpassword', (req, res) => res.render("users/forgot-password"));

router.post('/forgotpassword', users.forgotpassword);

router.get('/notification', (req, res) => {res.render('users/notification');});

router.get('/resetpassword', (req, res) => res.render('users/reset-password', { token: req.query.token }));

router.post('/resetpassword', users.resetpassword);

router.get('/logout', users.logout);


module.exports = router;
