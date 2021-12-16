'use strict';

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, user_post, logout } = require('../controllers/authController');

// This is the route for user to log in
router.post('/login', login);

// This is the route for user to register
// Requirement for a valid account: (1) Username must be at least 3 characters;
// (2) Email must be a valid email type;
// (3) Password should contains at least 8 character, at least 1 capital character and 1 number
router.post(
  '/register',
  body('username').isLength({ min: 3 }),
  body('email').isEmail().normalizeEmail(),
  body('password').matches('(?=.*[A-Z]).{8,}'),
  user_post
);

// This is the route for user to log out
router.get('/logout', logout);

module.exports = router;
