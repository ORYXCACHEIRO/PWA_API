const res = require('../models/reservations');
const reservationService = require('../services/reservations');

const service = reservationService(res);

module.exports = service;