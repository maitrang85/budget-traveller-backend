'use strict';

const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllPosts = async (next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT s.post_id, s.title, s.address, s.coords, s.content, s.region_id, s.created_date, s.edited_date, s.free_or_not, s.price, s.filename, s.user_id, u.username FROM camping_site AS s LEFT JOIN camping_user AS u ON s.user_id = u.user_id GROUP BY s.post_id ORDER BY s.created_date DESC'
    );
    return rows;
  } catch (e) {
    console.error('Model getAllPosts ', e.message);
    const err = httpError('SQL getAllPosts error', 500);
    next(err);
  }
};

const getPost = async (postId, next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT s.post_id, s.title, s.address, s.coords, s.content, s.region_id, s.created_date, s.edited_date, s.free_or_not, s.price, s.filename, s.user_id, u.username FROM camping_site AS s INNER JOIN camping_user AS u ON s.user_id = u.user_id WHERE s.post_id = ?',
      [postId]
    );
    return rows;
  } catch (e) {
    console.error('Model getPost ', e.message);
    const err = httpError('SQL getPost error', 500);
    next(err);
  }
};

const insertPost = async (post, next) => {
  if (!post.address) {
    post.address = '';
  }

  if (post.freeOrNot === 'free') {
    post.price = 0.0;
  }

  try {
    const [rows] = await promisePool.query(
      'INSERT INTO camping_site(title, address, coords, content, region_id, free_or_not, price, filename, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        post.title,
        post.address,
        post.coords,
        post.content,
        post.regionId,
        post.freeOrNot,
        post.price,
        post.filename,
        post.userId,
      ]
    );

    return rows.insertId;
  } catch (e) {
    console.error('Model insertPost ', e.message);
    const err = httpError('Cannot insert post', 500);
    next(err);
  }
};

const deletePost = async (postId, next) => {
  try {
    const [rows] = await promisePool.execute(
      'DELETE FROM camping_site WHERE post_id = ?',
      [postId]
    );
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('Model deletePost ', e.message);
    const err = httpError('Cannot delete post', 500);
    next(err);
  }
};

const updatePost = async (post, next) => {
  try {
    const [rows] = await promisePool.execute(
      'UPDATE camping_site SET title = ?, address =?, coords = ?, content = ?, region_id = ?, edited_date = ?, free_or_not = ?, price = ?, filename = ?, user_id = ? WHERE post_id = ?',
      [
        post.title,
        post.address,
        post.coords,
        post.content,
        post.regionId,
        post.editedDate,
        post.freeOrNot,
        post.price,
        post.filename,
        post.userId,
        post.postId,
      ]
    );

    return rows.affectedRows === 1;
  } catch (e) {
    console.error('Model updatePost ', e.message);
    const err = httpError('Cannot insert post', 500);
    next(err);
  }
};

module.exports = {
  getAllPosts,
  getPost,
  insertPost,
  deletePost,
  updatePost,
};
