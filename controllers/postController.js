'use strict';

require('dotenv').config();
const moment = require('moment');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const {
  getAllPosts,
  getPost,
  insertPost,
  deletePost,
  updatePost,
} = require('../models/postModel');

const { httpError } = require('../utils/errors');
const { getCoordinates } = require('../utils/imageMeta');
const { makeThumbnail } = require('../utils/resize');

const post_list_get = async (req, res, next) => {
  const posts = await getAllPosts();

  if (posts.length > 0) {
    res.json(posts);
    return;
  }

  const err = httpError('List of posts not found', 404);
  next(err);
};

const post_get = async (req, res, next) => {
  const post = await getPost(req.params.postId);

  if (post) {
    res.json(post);
    return;
  }

  const err = httpError('Requested post not found', 404);
  next(err);
};

const post_post = async (req, res, next) => {
  const post = req.body;
  post.filename = req.file.filename;
  post.userId = req.user.user_id;
  console.log('post body', post);

  if (!post.filename) {
    const err = httpError('Invalid file', 400);
    next(err);
    return;
  }

  if (!post.address) {
    post.address = '';
  }

  if (post.freeOrNot === 'free') {
    post.price = 0.0;
  }

  try {
    const coords = await getCoordinates(req.file.path);
    post.coords = JSON.stringify(coords);
    console.log('coords of img', coords);
  } catch {
    post.coords = JSON.stringify(
      await getGeoDataFromMapBox(post.address, post.regionId)
    );
    console.log('post.coords', post.coords);
  }

  const thumb = makeThumbnail(req.file.path, post.filename);

  try {
    const id = await insertPost(post, next);
    if (thumb) {
      res.json({ message: `A post created with id ${id}`, post_id: id });
    }
  } catch (e) {
    console.log('Error here', e);
    const err = httpError('Error uploading post', 400);
    next(err);
    return;
  }
};

const post_delete = async (req, res, next) => {
  try {
    const deleted = await deletePost(
      req.params.postId,
      req.user.user_id,
      req.user.role,
      next
    );
    res.json({ message: `Post deleted: ${deleted} ` });
  } catch (e) {
    const err = httpError('Error deleting post', 400);
    next(err);
    return;
  }
};

const post_update = async (req, res, next) => {
  const post = req.body;
  post.filename = req.file.filename;
  post.postId = req.params.postId;
  /* post.userId = req.user.user_id; */
  /* post.role = req.user.role; */

  console.log('post at upadate', post);
  if (!post.filename) {
    const err = httpError('Invalid file', 400);
    next(err);
    return;
  }

  try {
    const coords = await getCoordinates(req.file.path);
    post.coords = JSON.stringify(coords);
    console.log('coords of img', coords);
  } catch {
    post.coords = JSON.stringify(
      await getGeoDataFromMapBox(post.address, post.regionId)
    );
    console.log('post.coords', post.coords);
  }

  if (!post.address) {
    post.address = '';
  }

  if (post.freeOrNot === 'free') {
    post.price = 0.0;
  }

  post.postId = req.params.postId;
  post.editedDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const thumb = makeThumbnail(req.file.path, post.filename);

  try {
    const updated = await updatePost(post, req.user, next);
    if (thumb) {
      res.json({ message: `Post updated: ${updated}` });
    }
  } catch (e) {
    const err = httpError('Error updating post', 400);
    next(err);
    return;
  }
};

const getGeoDataFromMapBox = async (address, regionId) => {
  try {
    let mapboxQuery = '';
    if (address) {
      mapboxQuery = `${address}, Finland`;
    } else {
      mapboxQuery = `${regionId}, Finland`;
    }

    const geoData = await geocoder
      .forwardGeocode({
        query: `${mapboxQuery}`,
        limit: 1,
      })
      .send();
    const coords = [
      geoData.body.features[0].geometry.coordinates[1],
      geoData.body.features[0].geometry.coordinates[0],
    ];
    console.log('Coordinate in getGeoDataFromMapBox', coords);
    return coords;
  } catch (error) {
    console.log('Error in getGeoDateFromMapBox', error);
  }
};

module.exports = {
  post_list_get,
  post_get,
  post_post,
  post_delete,
  post_update,
};
