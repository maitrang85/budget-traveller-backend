'use strict';

const express = require('express');
const multer = require('multer');

const {
  comment_list_get,
  comment_get,
  comment_post,
  comment_delete,
  comment_update,
} = require('../controllers/commentController');

const router = express.Router({ mergeParams: true });

router.route('/').get(comment_list_get).post(comment_post);
router
  .route('/:commentId')
  .get(comment_get)
  .delete(comment_delete)
  .put(comment_update);

module.exports = router;
