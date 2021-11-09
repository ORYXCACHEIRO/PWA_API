const room = require('../models/rooms');
const roomService = require('../services/rooms');

const service = roomService(room);

module.exports = service;