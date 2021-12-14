'use strict';

const express = require('express');
const passport = require('../utils/pass');

const {
  reaction_get,
  reaction_post,
  reaction_delete,
  has_reacted_by_user,
} = require('../controllers/reactionController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), has_reacted_by_user)
  .delete(passport.authenticate('jwt', { session: false }), reaction_delete);
router
  .route('/:isLiked')
  .get(reaction_get)
  .post(passport.authenticate('jwt', { session: false }), reaction_post);

module.exports = router;
