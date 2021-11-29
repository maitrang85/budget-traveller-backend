'use strict';

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
  const post = await getPost(req.params.postId, next);

  if (post) {
    res.json(post);
    return;
  }

  const err = httpError('Requested post not found', 404);
  next(err);
};

const post_post = async (req, res, next) => {
  /* if (!req.file) {
    const err = httpError('Invalid file', 400);
    next(err);
    return;
  } */

  try {
    const post = req.body;
    /* post.filename = req.file.filename; */
    const id = await insertPost(post);
    res.json({ message: `A post created with id ${id}`, post_id: id });
  } catch (e) {
    const err = httpError('Error uploading post', 400);
    next(err);
    return;
  }
};

const post_delete = async (req, res) => {
  const deleted = await deletePost(req.params.postId);

  res.json({ message: `Post deleted: ${deleted} ` });
};

const post_update = async (req, res) => {
  req.body.id = req.params.postId;

  const updated = await updatePost(req.body);
  res.json({ message: `Cat updated: ${updated}` });
};

module.exports = {
  post_list_get,
  post_get,
  post_post,
  post_delete,
  post_update,
};
