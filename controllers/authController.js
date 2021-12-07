'use strict';

const jwt = require('jsonwebtoken');
const passport = require('passport');
const { httpError } = require('../utils/errors');

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

    const token = jwt.sign(user, 'jghfjghgfjhfgjfgdewiru');

    return res.json({ user, token });
  })(req, res, next);
};

module.exports = {
  login,
};
