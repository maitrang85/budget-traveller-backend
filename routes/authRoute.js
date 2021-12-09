'use strict';

const express = require('express');
const router = express.Router();
const { login, user_post, logout } = require('../controllers/authController');

router.post('/login', login);

router.post('/register', user_post);

router.get('/logout', logout);

module.exports = router;
