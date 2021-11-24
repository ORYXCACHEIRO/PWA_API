const user = require('../models/user');
const profileService = require('../services/profile');

const service = profileService(user);

module.exports = service;