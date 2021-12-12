'use strict';

const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwtSecret = process.env.JWT_SECRET;
const { httpError } = require('../utils/errors');
const { insertUser } = require('../models/userModel');

const login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      next(httpError('Username/password incorrect', 400));
      return;
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        next(httpError('Login failed', 400));
        return;
      }
    });

    const token = jwt.sign(user, jwtSecret);

    return res.json({ user, token });
  })(req, res, next);
};

const logout = (req, res) => {
  req.logout();
  res.json({ message: 'logout' });
};

const user_post = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('user_post validation', errors.array());
    const err = httpError('data not valid', 400);
    next(err);
    return;
  }

  try {
    req.body.password = bcrypt.hashSync(req.body.password, 12);

    const user = req.body;
    const id = await insertUser(user, next);
    res.json({ message: `A user created with id ${id}`, user_id: id });
  } catch (e) {
    const err = httpError('Error uploading user', 400);
    next(err);
    return;
  }
};

module.exports = {
  login,
  logout,
  user_post,
};
