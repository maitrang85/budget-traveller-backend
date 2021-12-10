'use strict';

const express = require('express');
const passport = require('../utils/pass');

const {
  checkToken,
  user_list_get,
  user_get,
  user_delete,
  user_update,
} = require('../controllers/userController');

const router = express.Router();

router.get(
  '/token',
  passport.authenticate('jwt', { session: false }),
  checkToken
);

router.route('/').get(user_list_get);

router
  .route('/:userId')
  .get(user_get)
  .delete(passport.authenticate('jwt', { session: false }), user_delete)
  .put(passport.authenticate('jwt', { session: false }), user_update);

module.exports = router;
