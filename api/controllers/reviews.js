const review = require('../models/reviews');
const reviewService = require('../services/reviews');

const service = reviewService(review);

module.exports = service;