const comodities = require('../models/comodities');
const comoditiesService = require('../services/comodities');

const service = comoditiesService(comodities);

module.exports = service;