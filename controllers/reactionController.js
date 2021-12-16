'use strict';

const {
  getReactions,
  insertReactions,
  deleteReaction,
  hasReactedByUser,
} = require('../models/reactionModel');

const { httpError } = require('../utils/errors');

// Controller for getting total likes or dislikes of a post
const reaction_get = async (req, res, next) => {
  const reaction = await getReactions(
    req.params.postId,
    req.params.isLiked,
    next
  );

  if (reaction) {
    res.json(reaction);
    return;
  }

  const err = httpError('Requested reaction not found', 404);
  next(err);
};

// Controller for checking if a post is liked/disliked by the logged-in user
const has_reacted_by_user = async (req, res, next) => {
  try {
    const reacted = await hasReactedByUser(
      req.params.postId,
      req.user.user_id,
      next
    );
    res.json(reacted);
  } catch (e) {
    const err = httpError(
      'Error getting reaction of this post from this user',
      400
    );
    next(err);
    return;
  }
};

// Controller for user to react to a post
const reaction_post = async (req, res, next) => {
  try {
    const id = await insertReactions(
      req.user.user_id,
      req.params.postId,
      req.params.isLiked,
      next
    );
    res.json({ message: `A reaction created: ${id}` });
  } catch (e) {
    const err = httpError('Error posting reaction', 400);
    next(err);
    return;
  }
};

// Controller for undoing the like/dislike of a post
const reaction_delete = async (req, res, next) => {
  try {
    const deleted = await deleteReaction(
      req.params.postId,
      req.user.user_id,
      next
    );
    res.json({ message: `Reaction deleted: ${deleted}` });
  } catch (e) {
    const err = httpError('Error deleting reaction', 400);
    next(err);
    return;
  }
};

module.exports = {
  reaction_get,
  reaction_post,
  reaction_delete,
  has_reacted_by_user,
};
