'use strict';

const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllFollowers = async (userId, next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT f.user_id, following.username AS username, following.email AS user_email, f.follower_id, followed.username AS followed_username, followed.email AS followed_email FROM camping_follower AS f INNER JOIN camping_user AS following ON f.user_id = following.user_id INNER JOIN camping_user AS followed ON f.follower_id = followed.user_id WHERE f.user_id = ?;',
      [userId]
    );
    return rows;
  } catch (e) {
    console.error('Model getAllFollowers ', e.message);
    const err = httpError('SQL getAllFollowers model error', 500);
    next(err);
  }
};

const insertFollower = async (userId, followerId, next) => {
  try {
    const [rows] = await promisePool.query(
      'INSERT INTO camping_follower(user_id, follower_id) VALUES (?, ?);',
      [userId, followerId]
    );
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('Model insertFollower', e.message);
    const err = httpError('Cannot insert follower', 500);
    next(err);
  }
};

const deleteFollower = async (userId, followerId, next) => {
  try {
    const [rows] = await promisePool.execute(
      'DELETE FROM camping_follower WHERE user_id = ? AND follower_id = ?;',
      [userId, followerId]
    );
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('Model deleteFollower ', e.message);
    const err = httpError('Cannot delete follower', 500);
    next(err);
  }
};

module.exports = {
  getAllFollowers,
  insertFollower,
  deleteFollower,
};
