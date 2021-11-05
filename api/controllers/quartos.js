const quarto = require('../models/quartos');
const quartoService = require('../services/quartos');

const service = quartoService(quarto);

module.exports = service;