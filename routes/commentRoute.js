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

router
  .route('/')
  .get(comment_list_get)
  .post(
    body('content').notEmpty().trim().escape(),
    passport.authenticate('jwt', { session: false }),
    comment_post
  );
router
  .route('/:commentId')
  .get(comment_get)
  .delete(passport.authenticate('jwt', { session: false }), comment_delete)
  .put(
    body('content').notEmpty().trim().escape(),
    passport.authenticate('jwt', { session: false }),
    comment_update
  );

module.exports = router;
