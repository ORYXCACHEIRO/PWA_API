const gallery = require('../models/gallery');
const galleryService = require('../services/gallery');

const service = galleryService(gallery);

module.exports = service;