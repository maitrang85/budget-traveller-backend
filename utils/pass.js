'use strict';

const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const bcrypt = require('bcryptjs');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { getUserLogin } = require('../models/userModel');

// local strategy for username password login
passport.use(
  new Strategy(async (username, password, done) => {
    const params = [username];
    try {
      const [user] = await getUserLogin(params);

      if (!user) {
        return done(null, false, { message: 'Incorrect email/password' });
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: 'Incorrect password/password' });
      }

      delete user.password;

      return done(null, { ...user }, { message: 'Logged In Successfully' });
    } catch (err) {
      return done(err);
    }
  })
);

// JWT strategy for handling bearer token
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jghfjghgfjhfgjfgdewiru',
    },
    (jwtPayload, done) => {
      console.log('jwt payload', jwtPayload);
      return done(null, jwtPayload);
    }
  )
);

module.exports = passport;
