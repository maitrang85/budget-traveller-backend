'use strict';

const express = require('express');
const passport = require('../utils/pass');

const {
  follower_list_get,
  follower_post,
  follower_delete,
} = require('../controllers/followerController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(follower_list_get)
  .post(passport.authenticate('jwt', { session: false }), follower_post)
  .delete(passport.authenticate('jwt', { session: false }), follower_delete);

module.exports = router;
