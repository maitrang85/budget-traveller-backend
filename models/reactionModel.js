'use strict';

const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

// Model for getting total likes or dislike of a post
// Parameter: postID from req.params, 0 (for number of dislikes) and 1 (number of likes) from req.params
// Return: object in JSON format containing reaction_count
const getReactions = async (postId, isLiked, next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT COUNT(isLiked) AS count_reaction FROM camping_reaction WHERE isLiked = ? AND post_id = ?;',
      [isLiked, postId]
    );
    return rows[0];
  } catch (e) {
    console.error('Model getReactions ', e.message);
    const err = httpError('SQL getReactions model error', 500);
    next(err);
  }
};

// Model for checking if the currently logged-in user liked or disliked of a post
// Parameter: postID from req.params, userId from req.user
// Return: object in JSON format containing array of rows extracted form the database if the user reacted to the post.
// Otherwise, return empty array.
const hasReactedByUser = async (postId, userId, next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM camping_reaction WHERE post_id = ? AND user_id = ?;',
      [postId, userId]
    );
    return rows;
  } catch (e) {
    console.error('Model hasReactedByUser ', e.message);
    const err = httpError('SQL hasReactedByUser model error', 500);
    next(err);
  }
};

// Model for inserting like or dislike of a post
// Parameter: postID from req.params, userId from req.user, isLiked from req.params
// Return: object in JSON format containing predetermined message
const insertReactions = async (userId, postId, isLiked, next) => {
  try {
    const [rows] = await promisePool.query(
      'INSERT INTO camping_reaction(post_id, user_id, isLiked) VALUES (?, ?, ?);',
      [postId, userId, isLiked]
    );
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('Model insertReactions ', e.message);
    const err = httpError('SQL insertReactions model error', 500);
    next(err);
  }
};

// Model for undoing a like or dislike of a post
// Parameter: postID from req.params, userId from req.user
// Return: object in JSON format containing predetermined message
const deleteReaction = async (postId, userId, next) => {
  try {
    const [rows] = await promisePool.execute(
      'DELETE FROM camping_reaction WHERE post_id = ? AND user_id = ?;',
      [postId, userId]
    );
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('Model deleteReaction ', e.message);
    const err = httpError('Cannot delete reaction', 500);
    next(err);
  }
};

module.exports = {
  getReactions,
  insertReactions,
  deleteReaction,
  hasReactedByUser,
};
