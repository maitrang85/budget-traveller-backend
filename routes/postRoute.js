'use strict';

const express = require('express');
const multer = require('multer');
const passport = require('../utils/pass');
const { body } = require('express-validator');

// Filter files uploaded by user, only accept images and videos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes('image') || file.mimetype.includes('video')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ dest: './uploads/', fileFilter });

const {
  post_list_get,
  post_get,
  post_post,
  post_delete,
  post_update,
} = require('../controllers/postController');

const router = express.Router();

// Without postId: route to get all the posts and route to insert post
router
  .route('/')
  .get(post_list_get)
  .post(
    passport.authenticate('jwt', { session: false }),
    upload.single('photo'),
    body('title').notEmpty().trim().escape(),
    body('content').notEmpty().trim().escape(),
    post_post
  );

// With specific postId: route to get a specific post, route to delete a post and route to update a post
router
  .route('/:postId')
  .get(post_get)
  .delete(passport.authenticate('jwt', { session: false }), post_delete)
  .put(
    passport.authenticate('jwt', { session: false }),
    upload.single('photo'),
    body('title').notEmpty().trim().escape(),
    body('content').notEmpty().trim().escape(),
    post_update
  );

module.exports = router;
