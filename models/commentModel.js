'use strict';

const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllComments = async (postId, next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT c.comment_id, c.content, c.created_date, c.edited_date, c.post_id, c.user_id, u.username, u.email, u.role FROM camping_comment AS c INNER JOIN camping_user AS u ON u.user_id = c.user_id WHERE c.post_id = ? ORDER BY c.created_date DESC;',
      [postId]
    );
    return rows;
  } catch (e) {
    console.error('Model getAllComments ', e.message);
    const err = httpError('SQL getAllComments model error', 500);
    next(err);
  }
};

const getComment = async (commentId, next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT c.comment_id, c.content, c.created_date, c.edited_date, c.post_id, c.user_id, u.username, u.email, u.role FROM camping_comment AS c INNER JOIN camping_user AS u ON u.user_id = c.user_id WHERE c.comment_id = ?;',
      [commentId]
    );
    return rows[0];
  } catch (e) {
    console.error('Model getComment ', e.message);
    const err = httpError('SQL getComment model error', 500);
    next(err);
  }
};

const insertComment = async (comment, next) => {
  try {
    const [rows] = await promisePool.query(
      'INSERT INTO camping_comment(content, user_id, post_id) VALUES (?, ?, ?);',
      [comment.content, comment.userId, comment.postId]
    );
    return rows.insertId;
  } catch (e) {
    console.error('Model insertComment', e.message);
    const err = httpError('Cannot insert comment', 500);
    next(err);
  }
};

const deleteComment = async (commentId, userId, role, next) => {
  let sql = 'DELETE FROM camping_comment WHERE comment_id = ? AND user_id = ?;';
  let params = [commentId, userId];

  if (role === 0) {
    sql = 'DELETE FROM camping_comment WHERE comment_id = ?;';
    params = [commentId];
  }

  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('Model deleteComment ', e.message);
    const err = httpError('Cannot delete comment', 500);
    next(err);
  }
};

const updateComment = async (comment, user, next) => {
  let sql =
    'UPDATE camping_comment SET content = ?, edited_date = ? WHERE comment_id = ? AND user_id = ?;';
  let params = [
    comment.content,
    comment.editedDate,
    comment.commentId,
    user.user_id,
  ];

  if (user.role === 0) {
    sql =
      'UPDATE camping_comment SET content = ?, edited_date = ?, user_id = ? WHERE comment_id = ?;';
    params = [
      comment.content,
      comment.editedDate,
      comment.userId,
      comment.commentId,
    ];
  }

  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('Model updateComment ', e.message);
    const err = httpError('Cannot insert comment', 500);
    next(err);
  }
};

module.exports = {
  getAllComments,
  getComment,
  insertComment,
  deleteComment,
  updateComment,
};
