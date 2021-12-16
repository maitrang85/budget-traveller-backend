'use strict';

const express = require('express');
const cors = require('cors');

const passport = require('./utils/pass');
const swagger = require('swagger-ui-express');

const authRoute = require('./routes/authRoute');
const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/userRoute');
const commentRoute = require('./routes/commentRoute');
const reactionRoute = require('./routes/reactionRoute');
const followerRoute = require('./routes/followerRoute');
const apiDoc = require('./apiDoc.json');
const { httpError } = require('./utils/errors');

const app = express();
app.use(cors());
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.static('uploads'));
app.use('/thumbnails', express.static('thumbnails'));

app.use('/auth', authRoute);
app.use('/post', postRoute);
app.use('/post/:postId/reaction', reactionRoute);
app.use('/post/:postId/comment', commentRoute);
app.use('/user', userRoute);
app.use('/user/:userId/follower', followerRoute);
app.use('/apiDoc', swagger.serve, swagger.setup(apiDoc));

app.use((req, res, next) => {
  const err = httpError('Not found', 404);
  next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal error' });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
