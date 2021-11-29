'use strict';

const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllUsers = async (next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, email, role FROM camping_user'
    );
    return rows;
  } catch (e) {
    const err = httpError('SQL error', 500);
    next(err);
  }
};

const getUser = async (userId, next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, email, role FROM camping_user WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  } catch (e) {
    const err = httpError('SQL error', 500);
    next(err);
  }
};

const insertUser = async (user, next) => {
  try {
    const [rows] = await promisePool.query(
      'INSERT INTO `camping_user`(`username`, `email`, `password`) VALUES (?, ?, ?)',
      [user.username, user.email, user.password]
    );
    return rows.insertId;
  } catch (e) {
    const err = httpError('Cannot insert user', 500);
    next(err);
  }
};

const deleteUser = async (userId, next) => {
  try {
    const [rows] = await promisePool.execute(
      'DELETE FROM camping_user WHERE user_id = ?',
      [userId]
    );
    return rows.affectedRows === 1;
  } catch (e) {
    const err = httpError('Cannot delete user', 500);
    next(err);
  }
};

const updateUser = async (user, next) => {
  console.log(user);
  try {
    const [rows] = await promisePool.query(
      'UPDATE camping_user SET username = ?, email = ?, password = ? WHERE user_id = ?',
      [user.username, user.email, user.password, user.id]
    );
    return rows.affectedRows === 1;
  } catch (e) {
    const err = httpError('Cannot insert user', 500);
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  insertUser,
  deleteUser,
  updateUser,
};
