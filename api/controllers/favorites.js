const favorites = require('../models/favorites');
const favoritesService = require('../services/favorites');

const service = favoritesService(favorites);

module.exports = service;