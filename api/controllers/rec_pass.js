const rec_pass_model = require('../models/rec_pass');
const rec_passService = require('../services/rec_pass');

const service = rec_passService(rec_pass_model);

module.exports = service;