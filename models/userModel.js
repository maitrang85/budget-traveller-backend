'use strict';

const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getUserLogin = async (params, next) => {
  try {
    console.log(params);
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

const deleteUser = async (userId, requestUser, next) => {
  let params = [userId];

  if (requestUser.user_id != userId && requestUser.role !== 0) {
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

const updateUser = async (user, requestUserId, requestUserEmail, next) => {
  let params = [user.username, requestUserEmail, user.password, requestUserId];

  /* if (requestUser.role === 0) {
    params = [user.username, user.email, user.password, user.userId];
  } */

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
