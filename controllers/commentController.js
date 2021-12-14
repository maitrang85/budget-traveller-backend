'use strict';

const { validationResult } = require('express-validator');
const moment = require('moment');
const {
  getAllComments,
  getComment,
  insertComment,
  deleteComment,
  updateComment,
} = require('../models/commentModel');

const { httpError } = require('../utils/errors');

// Controller for getting all comments of a post
const comment_list_get = async (req, res, next) => {
  try {
    const comments = await getAllComments(req.params.postId, next);
    res.json(comments);
  } catch {
    const err = httpError('List of comments not found', 404);
    next(err);
  }
};

// Controller for getting a comment in a post by their respective ID
const comment_get = async (req, res, next) => {
  const comment = await getComment(req.params.commentId, next);

  if (comment) {
    res.json(comment);
    return;
  }

  const err = httpError('Requested comment not found', 404);
  next(err);
};

// Controller for inserting a comment to a post
const comment_post = async (req, res, next) => {
  // Checking if the user sent valid data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('comment_post validation', errors.array());
    const err = httpError('data not valid', 400);
    next(err);
    return;
  }

  try {
    // Preparing the req.body before inserting to the database
    const comment = req.body;
    comment.userId = req.user.user_id;
    comment.postId = req.params.postId;
    const id = await insertComment(comment, next);
    res.json({ message: `A comment created with id ${id}`, comment_id: id });
  } catch (e) {
    const err = httpError('Error uploading comment', 400);
    next(err);
    return;
  }
};

// Controller for deleting a comment of a post
const comment_delete = async (req, res, next) => {
  try {
    const deleted = await deleteComment(
      req.params.commentId,
      req.user.user_id,
      req.user.role,
      next
    );
    res.json({ message: `Comment deleted: ${deleted}` });
  } catch (e) {
    const err = httpError('Error deleting comment', 400);
    next(err);
    return;
  }
};

// Controller for editting a comment
const comment_update = async (req, res, next) => {
  // Checking if the user sent valid data
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error('comment_update validation', errors.array());
    const err = httpError('data not valid', 400);
    next(err);
    return;
  }

  try {
    // Preparing the req.body before inserting to the database
    const comment = req.body;
    comment.commentId = req.params.commentId;
    comment.postId = req.params.postId;
    comment.editedDate = moment().format('YYYY-MM-DD HH:mm:ss');

    const updated = await updateComment(comment, req.user.user_id, next);
    res.json({ message: `Comment updated: ${updated}` });
  } catch (e) {
    const err = httpError('Error updating comment', 400);
    next(err);
    return;
  }
};

module.exports = {
  comment_list_get,
  comment_get,
  comment_post,
  comment_delete,
  comment_update,
};
