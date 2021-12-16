'use strict';

const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwtSecret = process.env.JWT_SECRET;
const { httpError } = require('../utils/errors');
const { insertUser } = require('../models/userModel');

// Login controller
const login = (req, res, next) => {
  // Authentication with passport using email and password
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

    // Token is created for sucessfully authenticated user
    const token = jwt.sign(user, jwtSecret);

    // This controller returns an object including all user info fetched from the database
    // and newly created token
    return res.json({ user, token });
  })(req, res, next);
};

// Logout controller to terminate login session.
// It also remove req.user properties as well as the associated token
const logout = (req, res) => {
  req.logout();
  res.json({ message: 'logout' });
};

// Register controller
const user_post = async (req, res, next) => {
  // Check if the account registration form sent by user containing valid data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('user_post validation', errors.array());
    const err = httpError('data not valid', 400);
    next(err);
    return;
  }

  try {
    // Hashing the password before storing it in the database
    req.body.password = bcrypt.hashSync(req.body.password, 12);

    // Inserting the info into the database using authModel
    const user = req.body;
    const id = await insertUser(user, next);
    res.json({ message: `Your profile created`, user_id: id });
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
