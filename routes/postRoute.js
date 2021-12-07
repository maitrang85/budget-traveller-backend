'use strict';

const express = require('express');
const multer = require('multer');
const passport = require('../utils/pass');

const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes('image')) {
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

router
  .route('/')
  .get(post_list_get)
  .post(
    passport.authenticate('jwt', { session: false }),
    upload.single('photo'),
    post_post
  );
router
  .route('/:postId')
  .get(post_get)
  .delete(passport.authenticate('jwt', { session: false }), post_delete)
  .put(
    passport.authenticate('jwt', { session: false }),
    upload.single('photo'),
    post_update
  );

module.exports = router;
