'use strict';

const {
  getAllUsers,
  getUser,
  insertUser,
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

const user_post = async (req, res, next) => {
  try {
    const user = req.body;
    const id = await insertUser(user);
    res.json({ message: `A user created with id ${id}`, user_id: id });
  } catch (e) {
    const err = httpError('Error uploading user', 400);
    next(err);
    return;
  }
};

const user_delete = async (req, res) => {
  const deleted = await deleteUser(req.params.userId);

  res.json({ message: `User deleted: ${deleted} ` });
};

const user_update = async (req, res) => {
  req.body.userId = req.params.userId;

  const updated = await updateUser(req.body);
  res.json({ message: `User updated: ${updated}` });
};

module.exports = {
  user_list_get,
  user_get,
  user_post,
  user_delete,
  user_update,
};
