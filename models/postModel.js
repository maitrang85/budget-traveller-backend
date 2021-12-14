'use strict';

const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

// Model for getting all posts in descending order by creatted date from the database with pagination option
// Parameters: page number from req.query
// Return: object in JSON format
const getAllPosts = async (page, next) => {
  // Getting the total number of posts currently in the database
  const totalPostsQuery =
    'SELECT COUNT(*) AS total_posts_count FROM camping_site';

  const [rows] = await promisePool.query(totalPostsQuery);
  const totalPosts = rows[0].total_posts_count;

  // Setting the limit (how many posts displayed per page)
  // and offset ( how many posts to skip before getting the required posts)
  let limit = page === 0 ? totalPosts : 9;
  let offset = page === 0 ? 0 : (page - 1) * limit;

  const query =
    'SELECT s.post_id, s.title, s.address, s.coords, s.content, s.region_id, s.created_date, s.edited_date, s.free_or_not, s.price, s.filename, s.user_id, u.username FROM camping_site AS s LEFT JOIN camping_user AS u ON s.user_id = u.user_id GROUP BY s.post_id ORDER BY s.created_date DESC LIMIT ? OFFSET ?;';

  try {
    const [rows] = await promisePool.query(query, [limit, offset]);
    const jsonResult = {
      total_posts_count: totalPosts,
      page_number: page,
      posts: rows,
    };
    return jsonResult;
  } catch (e) {
    console.error('Model getAllPosts ', e.message);
    const err = httpError('SQL getAllPosts error', 500);
    next(err);
  }
};

// Model for getting a specific post by postId
// Parameters: postId from req.params
// Return: object in JSON format
const getPost = async (postId, next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT s.post_id, s.title, s.address, s.coords, s.content, s.region_id, s.created_date, s.edited_date, s.free_or_not, s.price, s.filename, s.user_id, u.username FROM camping_site AS s INNER JOIN camping_user AS u ON s.user_id = u.user_id WHERE s.post_id = ?',
      [postId]
    );
    return rows[0];
  } catch (e) {
    console.error('Model getPost ', e.message);
    const err = httpError('SQL getPost error', 500);
    next(err);
  }
};

// Model for inserting a post
// Parameters: req.body
// Return: object in JSON format with predefined message
const insertPost = async (post, next) => {
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

// Model for deleting a post
// Parameters: postId from req.params, userId and role from req.user
// Return: object in JSON format with predefined message
const deletePost = async (postId, userId, role, next) => {
  let sql = 'DELETE FROM camping_site WHERE post_id = ? AND user_id = ?;';
  let params = [postId, userId];

  // Checking if a user is an admin.
  // If the user is an admin, he/she can delete posts which are not written by him/her.
  if (role === 0) {
    sql = 'DELETE FROM camping_site WHERE post_id = ?;';
    params = [postId];
  }

  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('Model deletePost ', e.message);
    const err = httpError('Cannot delete post', 500);
    next(err);
  }
};

// Model for updating a post
// Parameters: req.body and userId from req.user
// Return: object in JSON format with predefined message
const updatePost = async (post, userId, next) => {
  let sql =
    'UPDATE camping_site SET title = ?, address =?, coords = ?, content = ?, region_id = ?, edited_date = ?, free_or_not = ?, price = ?, filename = ?  WHERE post_id = ? AND user_id = ?;';
  let params = [
    post.title,
    post.address,
    post.coords,
    post.content,
    post.regionId,
    post.editedDate,
    post.freeOrNot,
    post.price,
    post.filename,
    post.postId,
    userId,
  ];

  try {
    const [rows] = await promisePool.execute(sql, params);
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
