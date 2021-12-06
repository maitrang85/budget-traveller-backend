'use strict';

const express = require('express');
const multer = require('multer');

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

router.route('/').get(post_list_get).post(upload.array('photos', 5), post_post);
router
  .route('/:postId')
  .get(post_get)
  .delete(post_delete)
  .put(upload.array('photos', 5), post_update);

module.exports = router;
