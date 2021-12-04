'use strict';

const moment = require('moment');

const {
  getAllPosts,
  getPost,
  insertPost,
  deletePost,
  updatePost,
} = require('../models/postModel');

const { httpError } = require('../utils/errors');

const post_list_get = async (req, res, next) => {
  const posts = await getAllPosts();

  if (posts.length > 0) {
    res.json(posts);
    return;
  }

  const err = httpError('List of posts not found', 404);
  next(err);
};

const post_get = async (req, res, next) => {
  const post = await getPost(req.params.postId);

  if (post) {
    res.json(post);
    return;
  }

  const err = httpError('Requested post not found', 404);
  next(err);
};

const post_post = async (req, res, next) => {
  const post = req.body;
  post.filenames = req.files;

  if (req.files.length === 0) {
    const err = httpError('Invalid file', 400);
    next(err);
    return;
  }

  if (!post.address) {
    post.address = '';
  }

  if (post.freeOrNot === 'free') {
    post.price = 0.0;
  }

  try {
    const id = await insertPost(post, next);
    res.json({ message: `A post created with id ${id}`, post_id: id });
  } catch (e) {
    console.log('Error here', e);
    const err = httpError('Error uploading post', 400);
    next(err);
    return;
  }
};

const post_delete = async (req, res, next) => {
  try {
    const deleted = await deletePost(req.params.postId, next);
    res.json({ message: `Post deleted: ${deleted} ` });
  } catch (e) {
    const err = httpError('Error deleting post', 400);
    next(err);
    return;
  }
};

const post_update = async (req, res, next) => {
  const post = req.body;
  post.filenames = req.files;

  if (req.files.length === 0) {
    const err = httpError('Invalid file', 400);
    next(err);
    return;
  }

  if (!post.address) {
    post.address = '';
  }

  if (post.freeOrNot === 'free') {
    post.price = 0.0;
  }
  post.postId = req.params.postId;
  post.editedDate = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    const updated = await updatePost(post, next);
    res.json({ message: `Post updated: ${updated}` });
  } catch (e) {
    const err = httpError('Error updating post', 400);
    next(err);
    return;
  }
};

module.exports = {
  post_list_get,
  post_get,
  post_post,
  post_delete,
  post_update,
};
