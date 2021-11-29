'use strict';

const express = require('express');

const {
  post_list_get,
  post_get,
  post_post,
  post_delete,
  post_update,
} = require('../controllers/postController');

const router = express.Router();

router.route('/').get(post_list_get).post(post_post);
router.route('/:postId').get(post_get).delete(post_delete).put(post_update);

module.exports = router;
