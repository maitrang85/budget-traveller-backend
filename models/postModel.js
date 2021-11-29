'use strict';

const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();
const moment = require('moment');

const getAllPosts = async (next) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM camping_site');
    return rows;
  } catch (e) {
    const err = httpError('SQL error', 500);
    next(err);
  }
};

const getPost = async (postId, next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM camping_site WHERE post_id = ?',
      [postId]
    );
    return rows[0];
  } catch (e) {
    const err = httpError('SQL error', 500);
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
      'INSERT INTO camping_site(title, address, content, region_id, free_or_not, price, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        post.title,
        post.address,
        post.content,
        post.regionId,
        post.freeOrNot,
        post.price,
        post.userId,
      ]
    );
    return rows.insertId;
  } catch (e) {
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
    const err = httpError('Cannot delete post', 500);
    next(err);
  }
};

const updatePost = async (post, next) => {
  if (!post.address) {
    post.address = '';
  }

  if (post.freeOrNot === 'free') {
    post.price = 0.0;
  }

  post.edittedDate = moment().format('YYYY-MM-DD HH:mm:ss');

  try {
    const [rows] = await promisePool.execute(
      'UPDATE camping_site SET title = ?, address =?, content = ?, region_id = ?, editted_date = ?, free_or_not = ?, price = ?, user_id = ? WHERE post_id = ?',
      [
        post.title,
        post.address,
        post.content,
        post.regionId,
        post.edittedDate,
        post.freeOrNot,
        post.price,
        post.userId,
        post.id,
      ]
    );

    return rows.affectedRows === 1;
  } catch (e) {
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
