'use strict';

const {
  getAllFollowers,
  insertFollower,
  deleteFollower,
} = require('../models/followerModel');

const { httpError } = require('../utils/errors');

const follower_list_get = async (req, res, next) => {
  try {
    const followers = await getAllFollowers(req.params.userId, next);
    res.json(followers);
  } catch {
    const err = httpError('Follower list of this user not found');
    next(err);
  }
};

const follower_post = async (req, res, next) => {
  try {
    const inserted = await insertFollower(
      req.user.user_id,
      req.params.userId,
      next
    );
    res.json({ message: `A follower is created: ${inserted}` });
  } catch (e) {
    const err = httpError('Error following this user', 400);
    next(err);
    return;
  }
};

const follower_delete = async (req, res, next) => {
  try {
    const deleted = await deleteFollower(
      req.user.user_id,
      req.params.userId,
      next
    );
    res.json({ message: `Comment deleted: ${deleted}` });
  } catch (e) {
    const err = httpError('Error unfollowing this user', 400);
    next(err);
    return;
  }
};

module.exports = {
  follower_list_get,
  follower_post,
  follower_delete,
};
