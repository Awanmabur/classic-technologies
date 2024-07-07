const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require("fs")

const account = require("../controllers/account");

const {user} = require("../middlewares/auth");

const {requireLogin} = require("../middlewares/loginrequest");
 

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


router.get('/profile', requireLogin, account.index);

router.post('/subscribe', account.subscribe);

router.get("/edit-userInfo/:id", requireLogin, account.edit );

router.post('/edit-user/:id', upload.single('imageUrl'), requireLogin, account.update);


module.exports = router;
