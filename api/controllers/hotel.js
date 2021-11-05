const hotel = require('../models/hotel');
const hotelService = require('../services/hotel');

const service = hotelService(hotel);

module.exports = service;