'use strict';

const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllPosts = async (next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM camping_site ORDER BY edited_date DESC'
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
      'SELECT * FROM camping_site WHERE post_id = ?',
      [postId]
    );
    return rows[0];
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

    const sql = addImagesToDatabase(post.filenames, rows.insertId);
    const [img_rows] = await promisePool.execute(sql);
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
      'UPDATE camping_site SET title = ?, address =?, content = ?, region_id = ?, edited_date = ?, free_or_not = ?, price = ?, user_id = ? WHERE post_id = ?',
      [
        post.title,
        post.address,
        post.content,
        post.regionId,
        post.editedDate,
        post.freeOrNot,
        post.price,
        post.userId,
        post.postId,
      ]
    );

    const [deletedImg] = await promisePool.execute(
      'DELETE FROM camping_image WHERE post_id = ?',
      [post.postId]
    );
    console.log('post filenames', post.filenames);
    const sql = addImagesToDatabase(post.filenames, post.postId);
    const [img_rows] = await promisePool.execute(sql);

    return rows.affectedRows === 1;
  } catch (e) {
    console.error('Model updatePost ', e.message);
    const err = httpError('Cannot insert post', 500);
    next(err);
  }
};

const addImagesToDatabase = (photos, postId) => {
  let sqlValues = photos.map((photo) => {
    return `('${photo.filename}', ${postId})`;
  });

  sqlValues = sqlValues.join(', ');
  const sql = `INSERT INTO camping_image(filename, post_id) VALUES ${sqlValues};`;
  return sql;
};

module.exports = {
  getAllPosts,
  getPost,
  insertPost,
  deletePost,
  updatePost,
};
