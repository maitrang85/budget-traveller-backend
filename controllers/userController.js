'use strict';

const {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
} = require('../models/userModel');

const { httpError } = require('../utils/errors');

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

const checkToken = (req, res, next) => {
  console.log('req.user', req.user);
  if (!req.user) {
    next(new Error('token not valid'));
  } else {
    res.json({ user: req.user });
  }
};

module.exports = {
  user_list_get,
  user_get,
  user_delete,
  user_update,
  checkToken,
};
