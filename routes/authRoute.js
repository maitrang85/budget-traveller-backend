'use strict';

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, user_post, logout } = require('../controllers/authController');

router.post('/login', login);

router.post(
  '/register',
  body('username').isLength({ min: 3 }),
  body('email').isEmail().normalizeEmail(),
  body('password').matches('(?=.*[A-Z]).{8,}'),
  user_post
);

router.get('/logout', logout);

module.exports = router;
