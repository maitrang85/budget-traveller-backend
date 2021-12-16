'use strict';

const express = require('express');
const passport = require('../utils/pass');
const { body } = require('express-validator');

const {
  comment_list_get,
  comment_get,
  comment_post,
  comment_delete,
  comment_update,
} = require('../controllers/commentController');

const router = express.Router({ mergeParams: true });

// Routes for get all the comments and insert a comment to a post
// Route for insert comments to a post is available only to authenticated users
router
  .route('/')
  .get(comment_list_get)
  .post(
    passport.authenticate('jwt', { session: false }),
    body('content').notEmpty().trim().escape(),
    comment_post
  );

// Route for get a specific comment (by commentId) of a post (by postId),
// delete a comment of a post, and update a comment of a post.
router
  .route('/:commentId')
  .get(comment_get)
  .delete(passport.authenticate('jwt', { session: false }), comment_delete)
  .put(
    passport.authenticate('jwt', { session: false }),
    body('content').notEmpty().trim().escape(),
    comment_update
  );

module.exports = router;
