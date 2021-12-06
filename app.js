'use strict';

const express = require('express');
const cors = require('cors');
//const swagger = require('swagger-ui-express');
const { httpError } = require('./utils/errors');
const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/userRoute');
const commentRoute = require('./routes/commentRoute');
const app = express();
const port = 3000;
//const apiDoc = require('./utils/swagger.json');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/post', postRoute);
app.use('/user', userRoute);
app.use('/post/:postId/comment', commentRoute);
//app.use('/apiDoc', swagger.serve, swagger.setup(apiDoc));

app.use((req, res, next) => {
  const err = httpError('Not found', 404);
  next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal error' });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
