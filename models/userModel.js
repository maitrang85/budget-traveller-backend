'use strict';

const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

// Model for checking if the user logged in or not
// Parameter: params(email of user)
// Return: object in JSON format containing user info in database
const getUserLogin = async (params, next) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM camping_user WHERE email = ?;',
      params
    );
    return rows;
  } catch (e) {
    console.log('error', e.message);
    const err = httpError('Error in getUserLogin model', 500);
    next(err);
  }
};

// Model for getting all users
// Return: array of objects in JSON format
const getAllUsers = async (next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, email, role FROM camping_user;'
    );
    return rows;
  } catch (e) {
    console.error('Model getAllUsers ', e.message);
    const err = httpError('SQL error in getAllUsers model', 500);
    next(err);
  }
};

// Model for getting a specific user
// Parameter: userId from req.params
// Return: object in JSON format containing user info in database
const getUser = async (userId, next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, email, role FROM camping_user WHERE user_id = ?;',
      [userId]
    );
    return rows[0];
  } catch (e) {
    console.error('Model getUser ', e.message);
    const err = httpError('SQL error in getUser model', 500);
    next(err);
  }
};

// Model for registering new user
// Parameter: user object from req.body
// Return: object in JSON format containing predetermined message
const insertUser = async (user, next) => {
  const isEmailExisting = await isEmailExiting(user.email);

  if (isEmailExisting.length === 0) {
    const [rows] = await promisePool.query(
      'INSERT INTO camping_user(username, email, password) VALUES (?, ?, ?);',
      [user.username, user.email, user.password]
    );
    return rows.insertId;
  }

  console.error('Model insertUser ', e.message);
  const err = httpError('Email already exists', 500);
  next(err);
};

// Model for users to delete their profile
// Parameter: userId from req.params, requestUserId and requestUserRole from req.user
// Return: object in JSON format containing user info in database
const deleteUser = async (userId, requestUserId, requestUserRole, next) => {
  let params = [userId];

  if (requestUserRole != 0 && requestUserId != userId) {
    params = [0];
  }

  try {
    const [rows] = await promisePool.execute(
      'DELETE FROM camping_user WHERE user_id = ?;',
      params
    );
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('Model deleteUser ', e.message);
    const err = httpError('Cannot delete user', 500);
    next(err);
  }
};

// Model for users to modify their profile
// Parameter: user object from req.body, requestUserId and requestUserEmail from req.user
// Return: object in JSON format containing user info in database
const updateUser = async (user, requestUserId, requestUserEmail, next) => {
  let params = [user.username, requestUserEmail, user.password, requestUserId];

  try {
    const [rows] = await promisePool.query(
      'UPDATE camping_user SET username = ?, email = ?, password = ? WHERE user_id = ?;',
      params
    );
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('Model updateUser ', e.message);
    const err = httpError('Cannot insert user', 500);
    next(err);
  }
};

// Function for checking if the email has already registered to the database
const isEmailExiting = async (email) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM camping_user WHERE email = ?;',
    [email]
  );
  return rows;
};

module.exports = {
  getUserLogin,
  getAllUsers,
  getUser,
  insertUser,
  deleteUser,
  updateUser,
};
