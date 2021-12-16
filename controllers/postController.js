'use strict';

require('dotenv').config();
const { validationResult } = require('express-validator');
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

// Controller to getting all the post from the newest to the oldest according to the created date of the post
const post_list_get = async (req, res, next) => {
  try {
    // Getting the page which the user wants to see.
    // If there is no page given, the default behavior is return all the posts in the database.
    const page = req.query.page ? Number(req.query.page) : 0;
    const posts = await getAllPosts(page, next);
    res.json(posts);
    return;
  } catch (e) {
    const err = httpError('List of posts not found', 404);
    next(err);
  }
};

// Controller for getting a specific post by postId
const post_get = async (req, res, next) => {
  const post = await getPost(req.params.postId);

  if (post) {
    post.coords = JSON.parse(post.coords);
    res.json(post);
    return;
  }

  const err = httpError('Requested post not found', 404);
  next(err);
};

// Controller for inserting a post
const post_post = async (req, res, next) => {
  // Checking if the user sent valid data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('post_post validation', errors.array());
    const err = httpError('data not valid', 400);
    next(err);
    return;
  }

  if (!req.file) {
    const err = httpError('Please input one valid image file', 400);
    next(err);
    return;
  }

  // Making thumbnail for frontend to use
  if (req.file.mimetype.includes('image')) {
    const thumb = makeThumbnail(req.file.path, req.file.filename);
  }

  const post = req.body;

  post.filename = req.file.filename;
  post.userId = req.user.user_id;

  // If filename is not valid (is not an image or video), error will be sent.
  if (!post.filename) {
    const err = httpError('Invalid file', 400);
    next(err);
    return;
  }

  // If the user does not input any address, the default for address will be empty string.
  if (!post.address) {
    post.address = '';
  }

  // If the user chooses 'free' for the campsite cost, the default price will be 0.0.
  if (post.freeOrNot === 'free') {
    post.price = 0.0;
  }

  // Getting the coordinates for campsite location
  // The coordinates can be attained via EXIF data in the image, address inputted by user or regionId
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

  try {
    const id = await insertPost(post, next);
    res.json({ message: `Your post created`, post_id: id });
  } catch (e) {
    console.log('Error here', e);
    const err = httpError('Error uploading post', 400);
    next(err);
    return;
  }
};

// Controller for deleting a post
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

// Controller of updating a post
const post_update = async (req, res, next) => {
  // Checking if the user sent valid data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('update_post validation', errors.array());
    const err = httpError('data not valid', 400);
    next(err);
    return;
  }

  if (!req.file) {
    const err = httpError('Please input one valid image file', 400);
    next(err);
    return;
  }

  const post = req.body;
  post.filename = req.file.filename;
  post.postId = req.params.postId;

  // If filename is not valid (is not an image or video), error will be sent.
  if (!post.filename) {
    const err = httpError('Invalid file', 400);
    next(err);
    return;
  }

  // Getting coordinates from EXIF data of the image or from inputted address or from regionId
  try {
    const coords = await getCoordinates(req.file.path);
    post.coords = JSON.stringify(coords);
  } catch {
    post.coords = JSON.stringify(
      await getGeoDataFromMapBox(post.address, post.regionId)
    );
  }

  // If the user does not input any address, the default for address will be empty string.
  if (!post.address) {
    post.address = '';
  }

  // If the user chooses 'free' for the campsite cost, the default price will be 0.0.
  if (post.freeOrNot === 'free') {
    post.price = 0.0;
  }

  post.postId = req.params.postId;
  post.editedDate = moment().format('YYYY-MM-DD HH:mm:ss');

  // Making thumbnail for frontend to use
  if (req.file.mimetype.includes('image')) {
    const thumb = makeThumbnail(req.file.path, post.filename);
  }

  try {
    const updated = await updatePost(post, req.user.user_id, next);
    res.json({ message: `Post updated: ${updated}` });
  } catch (e) {
    const err = httpError('Error updating post', 400);
    next(err);
    return;
  }
};

// Function for getting coordinates from Mapbox
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
