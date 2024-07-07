const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require("fs")

const {user} = require("../middlewares/auth");

const BlogPost = require('../models/BlogPost');

const blogPosts = require("../controllers/blogpost");

const {requireLogin} = require("../middlewares/loginrequest");

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


router.get('/blogPost', blogPosts.index);

router.get('/morePost/:id', checkLoginStatus, blogPosts.show);

router.get('/delete-blogPost/:postId', blogPosts.destroy );

router.get('/create-blogPost', requireLogin, blogPosts.create);

router.post('/create-blog', upload.single('image'), requireLogin, blogPosts.store);

router.get("/edit-blogPost/:id", requireLogin, blogPosts.edit );

router.post('/edit-blogPost/:id', upload.single('imageUrl'), requireLogin, blogPosts.update);


router.get('/like/:id', async (req, res) => {
  const postId = req.params.id;
  const post = await BlogPost.findById(postId);

  if (!post) {
      return res.status(404).send('Post not found');
  }

  if (post.likes === 0) {
      // If post has 0 likes, increment the count
      post.likes += 1;
  } else {
      // If post has more than 0 likes, decrement the count
      post.likes -= 1;
  }

  await post.save();
  res.redirect('/');
});


router.get('/love/:id', async (req, res) => {
const postId = req.params.id;
const post = await BlogPost.findById(postId);

if (!post) {
    return res.status(404).send('Post not found');
}

if (post.loves === 0) {
    // If post has 0 likes, increment the count
    post.loves += 1;
} else {
    // If post has more than 0 likes, decrement the count
    post.loves -= 1;
}

await post.save();
res.redirect('/');
});


// Comment on a post
router.post('/comment/:id', async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    post.comments.push({ text: req.body.comment, user: req.body.user });
    await post.save();
    res.redirect('/');
});

// Share a post
router.get('/share/:id', async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    post.shares += 1;
    await post.save();
    res.redirect('/');
});

module.exports = router;
