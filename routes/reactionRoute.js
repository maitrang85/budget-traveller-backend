'use strict';

const express = require('express');
const passport = require('../utils/pass');

const {
  reaction_get,
  reaction_post,
  reaction_delete,
} = require('../controllers/reactionController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .delete(passport.authenticate('jwt', { session: false }), reaction_delete);
router
  .route('/:isLiked')
  .get(reaction_get)
  .post(passport.authenticate('jwt', { session: false }), reaction_post);

module.exports = router;
