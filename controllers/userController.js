'use strict';

const {
  getAllUsers,
  getUser,
  insertUser,
  deleteUser,
  updateUser,
} = require('../models/userModel');

const { httpError } = require('../utils/errors');

const checkToken = (req, res, next) => {
  if (!req.user) {
    next(new Error('token not valid'));
  } else {
    res.json({ user: req.user });
  }
};

const user_list_get = async (req, res, next) => {
  const users = await getAllUsers();

  if (users.length > 0) {
    res.json(users);
    return;
  }

  const err = httpError('List of users not found', 404);
  next(err);
};

const user_get = async (req, res, next) => {
  const user = await getUser(req.params.userId, next);

  if (user) {
    res.json(user);
    return;
  }

  const err = httpError('Requested user not found', 404);
  next(err);
};

const user_post = async (req, res, next) => {
  try {
    const user = req.body;
    const id = await insertUser(user, next);
    res.json({ message: `A user created with id ${id}`, user_id: id });
  } catch (e) {
    const err = httpError('Error uploading user', 400);
    next(err);
    return;
  }
};

const user_delete = async (req, res, next) => {
  try {
    const deleted = await deleteUser(req.params.userId, req.user, next);
    res.json({ message: `User deleted: ${deleted} ` });
  } catch (e) {
    const err = httpError('Error deleting user', 400);
    next(err);
    return;
  }
};

const user_update = async (req, res, next) => {
  try {
    req.body.userId = req.params.userId;
    console.log('req body', req.body);
    console.log('req user', req.user);
    const updated = await updateUser(req.body, req.user, next);
    res.json({ message: `User updated: ${updated}` });
  } catch (e) {
    const err = httpError('Error updating user', 400);
    next(err);
    return;
  }
};

module.exports = {
  checkToken,
  user_list_get,
  user_get,
  user_post,
  user_delete,
  user_update,
};
