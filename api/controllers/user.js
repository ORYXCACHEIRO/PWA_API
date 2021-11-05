const user = require('../models/user');
const userService = require('../services/user');

const service = userService(user);

module.exports = service;