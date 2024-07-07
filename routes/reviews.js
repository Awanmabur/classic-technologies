const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require("fs")

const review = require('../models/review');

const reviews = require("../controllers/review");

const {checkLoginStatus} = require("../middlewares/loginStatus");


// Set storage engine for multer
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});

// const upload = multer({ storage: storage });
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Check file format
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      req.fileValidationError = 'Only JPEG, PNG, and jpg images are allowed!';
      cb(null, false);
    }
  },
});


router.get('/review', reviews.index);

router.get('/morereview/:id', checkLoginStatus, reviews.show);

router.get('/delete-review/:postId', reviews.destroy );

router.get('/create-review', reviews.create);

router.post('/createReview', upload.single('image'), reviews.store);

router.get("/edit-review/:id", reviews.edit );

router.post('/edit-review/:id', upload.single('imageUrl'), reviews.update);



module.exports = router;
