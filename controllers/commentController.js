'use strict';

const moment = require('moment');
const {
  getAllComments,
  getComment,
  insertComment,
  deleteComment,
  updateComment,
} = require('../models/commentModel');

const { httpError } = require('../utils/errors');

const comment_list_get = async (req, res, next) => {
  console.log('post id', req.params);
  const comments = await getAllComments(req.params.postId);

  if (comments.length > 0) {
    res.json(comments);
    return;
  }

  const err = httpError('List of comments not found', 404);
  next(err);
};

const comment_get = async (req, res, next) => {
  const comment = await getComment(req.params.commentId);

  if (comment) {
    res.json(comment);
    return;
  }

  const err = httpError('Requested comment not found', 404);
  next(err);
};

const comment_post = async (req, res, next) => {
  try {
    const comment = req.body;
    console.log('comment', req.body);
    const id = await insertComment(req.params.postId, comment);
    res.json({ message: `A comment created with id ${id}`, comment_id: id });
  } catch (e) {
    const err = httpError('Error uploading comment', 400);
    next(err);
    return;
  }
};

const comment_delete = async (req, res) => {
  const deleted = await deleteComment(req.params.commentId);

  res.json({ message: `Comment deleted: ${deleted} ` });
};

const comment_update = async (req, res) => {
  req.body.commentId = req.params.commentId;
  req.body.editedDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const updated = await updateComment(req.body);
  res.json({ message: `Comment updated: ${updated}` });
};

module.exports = {
  comment_list_get,
  comment_get,
  comment_post,
  comment_delete,
  comment_update,
};
