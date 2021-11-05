const idioma = require('../models/idioma');
const idiomaService = require('../services/idioma');

const service = idiomaService(idioma);

module.exports = service;