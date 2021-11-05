const avaliacao = require('../models/avaliacoes');
const avService = require('../services/avaliacoes');

const service = avService(avaliacao);

module.exports = service;