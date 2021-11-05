const comodidades = require('../models/comodidades');
const comoService = require('../services/comodidades');

const service = comoService(comodidades);

module.exports = service;