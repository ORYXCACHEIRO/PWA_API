const lang = require('../models/langs');
const languageService = require('../services/langs');

const service = languageService(lang);

module.exports = service;